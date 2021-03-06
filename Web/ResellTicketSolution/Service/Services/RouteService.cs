﻿using Algorithm.KShortestPaths;
using Algorithm.KShortestPaths.Models;
using AutoMapper;
using Core.Enum;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using Microsoft.Extensions.Options;
using Service.EmailService;
using Service.Helpers;
using Service.NotificationService;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using ViewModel.AppSetting;
using ViewModel.ErrorViewModel;
using ViewModel.ViewModel.ResolveOptionLog;
using ViewModel.ViewModel.Route;

namespace Service.Services
{
    public interface IRouteService
    {
        /// <summary>
        /// Search Route with some filter parameters
        /// </summary>
        /// <param name="departureCityId">Required. Route departure</param>
        /// <param name="arrivalCityId">Required. Route Destination</param>
        /// <param name="page">Page number. Start at 1.</param>
        /// <param name="pageSize">Page Size</param>
        /// <param name="maxCombinationTickets">Max tickets a route has</param>
        /// <param name="arrivalDate">Get only routes that arrive before this date</param>
        /// <param name="departureDate">Get only routes that start after this date</param>
        /// <param name="maxWaitingHours">If route has many tickets, each sequence ticket must not wait more than this hour</param>
        /// <param name="ticketTypeIds">list of ticket types allow to search</param>
        /// <param name="transportationIds">list of transportations allow to search</param>
        /// <param name="vehicleIds">list of vehicles allow to search</param>
        /// <returns>List search results.</returns>
        List<RouteSearchViewModel> SearchRoute(int departureCityId, int arrivalCityId,
            DateTime departureDate, DateTime arrivalDate, int page, int pageSize, string searchedUsername = null, 
            int maxCombinationTickets = 3, int[] vehicleIds = null, int[] transportationIds = null, 
            int maxWaitingHours = 24, int[] ticketTypeIds = null, SearchRouteOrderByEnum orderBy = SearchRouteOrderByEnum.Price);

        /// <summary>
        /// Create new Route base on Search result
        /// </summary>
        /// <param name="route">Route Search View Model</param>
        /// <param name="customerUserName">Created By this user</param>
        /// <returns>Return Route Id</returns>
        int AddRoute(RouteSearchViewModel route, string customerUserName);

        /// <summary>
        /// Get route detail
        /// </summary>
        /// <param name="routeId">Id of a route</param>
        /// <returns>Route Detail with Route Ticket details</returns>
        RouteDetailViewModel GetRouteDetail(int routeId);
        RouteDetailViewModel GetRouteDetailForAdmin(int routeId);

        /// <summary>
        /// Get Route data table for display in List
        /// </summary>
        /// <param name="page">required. page number start at 1.</param>
        /// <param name="pageSize">required. page size</param>
        /// <param name="status">optional. Status of routes</param>
        /// <returns>Route data table (route information and tickets in that route</returns>
        RouteDataTable GetRouteDataTable(int page, int pageSize,
            RouteStatus? status, string userName); //customer

        RouteDataTable GetLiabilityRoutes(string param, int page, int pageSize); // liability - admin

        RouteDataTable GetBoughtRoutes(string param, int page, int pageSize); // bought - admin

        RouteDataTable GetCompletedRoutes(string param, int page, int pageSize);// completed - admin

        /// <summary>
        /// Update Route 
        /// </summary>
        /// <param name="route">Route detail to update</param>
        void UpdateRoute(RouteDetailViewModel route);

        /// <summary>
        /// Delete Route (set deleted = true for Route and RouteTicket)
        /// </summary>
        /// <param name="routeId"></param>
        void DeleteRoute(int routeId);

        /// <summary>
        /// Update Route Ticket with a new Ticket
        /// </summary>
        /// <param name="paramsModel">Update Params</param>
        void UpdateRouteTicket(RouteTicketUpdateParams paramsModel);

        string BuyRoute(BuyRouteParams model, string username);

        /// <summary>
        /// creat new RouteTicket by routeId and replaceTicketId 
        /// with order = order of the fail ticket
        /// </summary>
        /// <param name="routeId"></param>
        /// <param name="failRouteTicketId"></param>
        /// <param name="replaceTicketId"></param>
        void ReplaceOneFailTicket(int routeId, int failRouteTicketId, int replaceTicketId, string username);

        StatisticReportViewModel GetStatisticReport();
    }

    public class RouteService : IRouteService
    {
        private readonly IRouteRepository _routeRepository;
        private readonly IRouteTicketRepository _routeTicketRepository;
        private readonly ICityRepository _cityRepository;
        private readonly ITicketRepository _ticketRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly IOneSignalService _oneSignalService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly INotificationService _notificationService;
        private readonly IOptions<CrediCardSetting> SETTING;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IRefundRepository _refundRepository;
        private readonly IUserRepository _userRepository;
        private readonly IResolveOptionLogRepository _resolveOptionLogRepository;
        private readonly ISendGridService _sendGridService;


        public RouteService(
                IRouteRepository routeRepository,
                IRouteTicketRepository routeTicketRepository,
                ITicketRepository ticketRepository,
                ICityRepository cityRepository,
                ICustomerRepository customerRepository,
                IUnitOfWork unitOfWork,
                IMapper mapper,
                IOneSignalService oneSignalService,
                INotificationService notificationService,
                IOptions<CrediCardSetting> options,
                IPaymentRepository paymentRepository,
                IRefundRepository refundRepository,
                IUserRepository userRepository,
                 IResolveOptionLogRepository resolveOptionLogRepository,
                 ISendGridService sendGridService
            )
        {
            _routeRepository = routeRepository;
            _routeTicketRepository = routeTicketRepository;
            _ticketRepository = ticketRepository;
            _cityRepository = cityRepository;
            _customerRepository = customerRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _oneSignalService = oneSignalService;
            _notificationService = notificationService;
            SETTING = options;
            _paymentRepository = paymentRepository;
            _refundRepository = refundRepository;
            _userRepository = userRepository;
            _resolveOptionLogRepository = resolveOptionLogRepository;
            _sendGridService = sendGridService;
        }

        public void DeleteRoute(int routeId)
        {
            var route = _routeRepository.Get(x => x.Id == routeId && x.Deleted == false);
            if (route != null)
            {
                //Delete RouteTicket first
                var routeDetails = route.RouteTickets;
                foreach (var routeDetail in routeDetails)
                {
                    routeDetail.Deleted = true;
                    _routeTicketRepository.Update(routeDetail);
                }

                //Delete Route master
                route.Deleted = true;
                _routeRepository.Update(route);

                //Commit into database
                _unitOfWork.CommitChanges();
            }
        }

        public RouteDataTable GetRouteDataTable(int page, int pageSize, RouteStatus? status, string userName) 
        {
            var customer = _customerRepository.Get(x =>
                x.Username == userName &&
                x.Deleted == false &&
                x.IsActive == true
            );

            if (customer == null)
                throw new NotFoundException();

            //Get route view models
            var routes = _routeRepository.GetAllQueryable()
                .Where(x => x.Deleted == false && x.CustomerId == customer.Id)
                .Select(x => new RouteRowViewModel()
                {
                    Id = x.Id,
                    Code = x.Code,
                    CreatedAt = x.UpdatedAtUTC ?? x.CreatedAtUTC,
                    CustomerId = x.CustomerId,
                    Status = x.Status,
                    TotalAmount = x.TotalAmount,
                    TicketQuantity = x.RouteTickets.Count(t => t.IsReplaced != true),
                    ExpiredDate = x.RouteTickets.Min(routeTicket => routeTicket.Ticket.ExpiredDateTime),
                    //ResolveOption = x.ResolveOption,
                    //Check valid or not depen on ticket status
                    IsValid = !x.RouteTickets.Any(routeTicket => routeTicket.Deleted == false && 
                    (routeTicket.Ticket.Status != TicketStatus.Valid || routeTicket.Ticket.ArrivalDateTimeUTC < DateTime.UtcNow)),
                    IsRefundAll = x.IsRefundAll
                })
                .OrderByDescending(x => x.CreatedAt);

            //Filter routes match user's criticals
            var routesFiltered = routes.Where(x =>
                (status == null || x.Status == status)
            );

            //Paging routes
            var routesPaged = routesFiltered.Skip((page - 1) * pageSize).Take(pageSize);

            //Create result view model
            var result = new RouteDataTable()
            {
                Data = routesPaged.ToList(),
                Total = routesFiltered.Count(),
            };

            //getting more detail information
            foreach (var route in result.Data)
            {
                var routeTickets = _routeTicketRepository.GetAllQueryable().Where(x =>
                    x.RouteId == route.Id &&
                    x.IsReplaced != true
                ).OrderBy(x => x.Order);
                var firstRouteTicket = routeTickets.FirstOrDefault();
                route.DepartureCityName = firstRouteTicket.DepartureStation.City.Name;
                route.DepartureDate = firstRouteTicket.Ticket.DepartureDateTime;
                route.ExpiredDateTime = firstRouteTicket.Ticket.ExpiredDateTime;

                var lastRouteTicket = routeTickets.LastOrDefault();
                route.ArrivalCityName = lastRouteTicket.ArrivalStation.City.Name;
                route.ArrivalDate = lastRouteTicket.Ticket.ArrivalDateTime;
            }

            return result;
        }

        public RouteDetailViewModel GetRouteDetail(int routeId) //customer
        {
            var route = _routeRepository.Get(x =>
                x.Deleted == false &&
                x.Id == routeId
            );

            if (route == null)
            {
                throw new NotFoundException();
            }

            var routeViewModel = _mapper.Map<Route, RouteDetailViewModel>(route);
            routeViewModel.BuyerPhone = route.Customer.PhoneNumber;
            //routeViewModel.ResolveOption = route.ResolveOption;
            routeViewModel.RouteTickets = new List<RouteTicketDetailViewModel>();

            //Parse route ticket into viewmodel

            foreach (var routeTicket in route.RouteTickets.Where(x => x.IsReplaced != true && x.Deleted == false))
            {
                var routeTicketViewModel = _mapper.Map<RouteTicket, RouteTicketDetailViewModel>(routeTicket);
                //routeTicketViewModel.SellerPhone = routeTicket.Ticket.Seller.PhoneNumber;
                routeTicketViewModel.ExpiredDateTime = routeTicket.Ticket.ExpiredDateTime;
                if(routeTicket.Ticket.Status == TicketStatus.Valid && routeTicket.Ticket.DepartureDateTimeUTC < DateTime.UtcNow)
                {
                    routeTicketViewModel.Status = 0;
                }
                var refundedTicket = _resolveOptionLogRepository.Get(x => x.RouteId == routeTicket.RouteId && x.TicketId == routeTicket.TicketId);
                if (refundedTicket != null && refundedTicket.Option < ResolveOption.PAYOUT)
                {
                    routeTicketViewModel.IsRefunded = true;
                }
                routeViewModel.RouteTickets.Add(routeTicketViewModel);
            }
            routeViewModel.RouteTickets = routeViewModel.RouteTickets.OrderBy(x => x.Order).ToList();

            return routeViewModel;
        }

        public RouteDetailViewModel GetRouteDetailForAdmin(int routeId) //admin
        {
            var route = _routeRepository.Get(x => x.Id == routeId);

            if (route == null)
            {
                throw new NotFoundException();
            }

            var routeViewModel = _mapper.Map<Route, RouteDetailViewModel>(route);
            routeViewModel.BuyerPhone = route.Customer.PhoneNumber;
            routeViewModel.BuyerName = route.Customer.FullName;
            //routeViewModel.ResolveOption = route.ResolveOption;
            routeViewModel.RouteTickets = new List<RouteTicketDetailViewModel>();
            routeViewModel.ResolveOptionLogs = new List<ResolveOptionLogViewModel>();

            //Parse route ticket into viewmodel

            foreach (var routeTicket in route.RouteTickets.Where(x => x.Deleted == false))
            {
                if (_resolveOptionLogRepository.Get(x => x.RouteId == routeTicket.RouteId && x.TicketId == routeTicket.TicketId) == null)
                {
                    var routeTicketViewModel = _mapper.Map<RouteTicket, RouteTicketDetailViewModel>(routeTicket);
                    routeTicketViewModel.SellerPhone = routeTicket.Ticket.Seller.PhoneNumber;
                    routeViewModel.RouteTickets.Add(routeTicketViewModel);
                }
            }
            //routeViewModel.EarnedLoss = route.TotalAmount;
            //decimal refundAmount = 0;
            //decimal payoutAmount = 0;
            foreach (var resolveOption in route.ResolveOptionLogs)
            {
                
                var routeTicket = _routeTicketRepository.Get(x => x.RouteId == resolveOption.RouteId && x.TicketId == resolveOption.TicketId);
                if (resolveOption.Option != ResolveOption.REPLACE)
                {
                    //routeViewModel.EarnedLoss = routeViewModel.EarnedLoss - routeTicket.Ticket.SellingPrice;
                    //if (resolveOption.Option == ResolveOption.PAYOUT)
                    //{
                    //    routeViewModel.EarnedLoss = routeViewModel.EarnedLoss + Math.Round(routeTicket.Ticket.SellingPrice * (routeTicket.Ticket.CommissionPercent / 100), 2);
                    //}
                    routeViewModel.EarnedLoss += resolveOption.Amount;
                } else
                {
                    routeViewModel.TotalAmount += resolveOption.Amount;
                }

                var resolveOptionLogViewModel = new ResolveOptionLogViewModel()
                {
                    ResolvedTicketCode = resolveOption.ResolvedTicket.TicketCode,
                    StaffName = resolveOption.Staff.FullName,
                    ResolveAt = resolveOption.CreatedAtUTC.ToLocalTime(),
                    Option = resolveOption.Option,
                    DepartureCityName = routeTicket.Ticket.DepartureStation.City.Name,
                    ArrivalCityName = routeTicket.Ticket.ArrivalStation.City.Name,
                    DepartureDateTime = routeTicket.Ticket.DepartureDateTime,
                    ArrivalDateTime = routeTicket.Ticket.ArrivalDateTime,
                    SellingPrice = routeTicket.Ticket.SellingPrice,
                    Amount = resolveOption.Amount
                };
                if (resolveOption.Option == ResolveOption.REPLACE)
                {
                    resolveOptionLogViewModel.ReplacedTicketCode = resolveOption.ReplacedTicketCode;
                }
                routeViewModel.ResolveOptionLogs.Add(resolveOptionLogViewModel);
            }
            routeViewModel.ResolveOptionLogs = routeViewModel.ResolveOptionLogs.OrderByDescending(x => x.ResolveAt).ToList();
            routeViewModel.RouteTickets = routeViewModel.RouteTickets.OrderBy(x => x.Order).ToList();
            //routeViewModel.profitLoss += (payoutAmount - refundAmount);
            routeViewModel.EarnedLoss = route.TotalAmount - routeViewModel.EarnedLoss;
            return routeViewModel;
        }

        public int AddRoute(RouteSearchViewModel model, string customerUserName)
        {
            var customer = _customerRepository.Get(x =>
                x.Username == customerUserName &&
                x.Deleted == false
            );

            if (customer == null)
            {
                throw new NotFoundException();
            }

            var route = new Route()
            {
                Code = GenerateRouteCode(),
                CustomerId = customer.Id,
                Deleted = false,
                Status = RouteStatus.New,
                TotalAmount = model.TotalAmount,
            };

            var routeTickets = _mapper.Map<List<RouteTicketSearchViewModel>, List<RouteTicket>>(model.RouteTickets);

            _unitOfWork.StartTransaction();

            _routeRepository.Add(route);
            _unitOfWork.CommitChanges();

            foreach (var routeTicket in routeTickets)
            {
                routeTicket.RouteId = route.Id;
                _routeTicketRepository.Add(routeTicket);
            }

            _unitOfWork.CommitTransaction();

            return route.Id;
        }

        public List<RouteSearchViewModel> SearchRoute(int departureCityId, int arrivalCityId,
            DateTime departureDate, DateTime arrivalDate, int page, int pageSize, string searchedUsername = null, 
            int maxCombinationTickets = 3, int[] vehicleIds = null, int[] transportationIds = null, 
            int maxWaitingHours = 24, int[] ticketTypeIds = null, SearchRouteOrderByEnum orderBy = SearchRouteOrderByEnum.Price)
        {
            //Convert fromDate, toDate into UTC
            var departureCity = _cityRepository.Get(x => x.Id == departureCityId && x.Deleted == false);
            if (departureCity == null) throw new NotFoundException("Not Found Depoarture City");
            var arrivalCity = _cityRepository.Get(x => x.Id == arrivalCityId && x.Deleted == false);
            if (arrivalCity == null) throw new NotFoundException("Not Found Arrival City");

            var departureDateUTC = departureDate.ToSpecifiedTimeZone(departureCity.TimeZoneId);
            var arrivalDateUTC = arrivalDate.ToSpecifiedTimeZone(arrivalCity.TimeZoneId);

            //Get raw available tickets in db
            var tickets = _ticketRepository.GetAllQueryable()
                .Where(x =>
                    x.Status == Core.Enum.TicketStatus.Valid &&
                    x.Deleted == false &&
                    x.DepartureDateTimeUTC >= departureDateUTC &&
                    x.ArrivalDateTimeUTC <= arrivalDateUTC &&
                    (x.ExpiredDateTimeUTC == null || x.ExpiredDateTimeUTC >= DateTime.UtcNow) &&
                    (vehicleIds == null || vehicleIds.Length == 0 || vehicleIds.Contains(x.Transportation.VehicleId)) &&
                    (transportationIds == null || transportationIds.Length == 0 || transportationIds.Contains(x.TransportationId)) &&
                    (ticketTypeIds == null || ticketTypeIds.Length == 0 || ticketTypeIds.Contains(x.TicketTypeId)) && 
                    (searchedUsername == null || searchedUsername.Length == 0 || searchedUsername != x.Seller.Username)
                );

            //return empty list in case of no input data
            if (tickets.Count() == 0)
            {
                return new List<RouteSearchViewModel>();
            }


            //create graph base on available tickets
            var graph = new EppsteinGraph();
            foreach (var ticket in tickets)
            {
                switch (orderBy)
                {
                    case SearchRouteOrderByEnum.Price:
                        graph.CreateEdgeFromTicketBaseOnPrice(ticket);
                        break;
                    case SearchRouteOrderByEnum.TotalTravelingTime:
                        graph.CreateEdgeFromTicketBaseOnTravelingTime(ticket);
                        break;
                    case SearchRouteOrderByEnum.ArrivalDate:
                        graph.CreateEdgeFromTicketBaseOnArrivalDate(ticket);
                        break;
                    default:
                        graph.CreateEdgeFromTicketBaseOnPrice(ticket);
                        break;
                }
            }

            //Calculate k shortest paths
            graph.BuildKthShortestPaths(
                departureId: departureCityId,
                destinationId: arrivalCityId,
                maxCombination: maxCombinationTickets,
                kshortestPathQuantity: page * pageSize,
                maxWaitingHours: maxWaitingHours, 
                isBasedOnArrivalDate: orderBy == SearchRouteOrderByEnum.ArrivalDate,
                isBasedOnTravelingTime: orderBy == SearchRouteOrderByEnum.TotalTravelingTime
            );

            //Get k shortest path
            var paths = new List<Path>();
            for (int count = 0; count < page * pageSize; count++)
            {
                var path = graph.FindNextShortestPath().Trim();
                if (!path.IsValid)
                    break;
                paths.Add(path);
            }

            var routes = new List<RouteSearchViewModel>();
            foreach (var path in paths.Skip((page - 1) * pageSize).Take(pageSize))
            {
                var routeSearchViewModel = new RouteSearchViewModel();

                int count = 0;
                foreach (var edge in path)
                {
                    var ticket = edge.Data as Ticket;
                    var ticketModel = new RouteTicketSearchViewModel()
                    {
                        TicketId = ticket.Id,
                        ArrivalCityId = ticket.ArrivalStation.CityId,
                        ArrivalCityName = ticket.ArrivalStation.City.Name,
                        ArrivalStationId = ticket.ArrivalStationId,
                        ArrivalStationName = ticket.ArrivalStation.Name,
                        ArrivalDateTime = ticket.ArrivalDateTime,
                        DepartureCityId = ticket.DepartureStation.CityId,
                        DepartureCityName = ticket.DepartureStation.City.Name,
                        DepartureStationId = ticket.DepartureStationId,
                        DepartureStationName = ticket.DepartureStation.Name,
                        DepartureDateTime = ticket.DepartureDateTime,
                        TransportationName = ticket.Transportation.Name,
                        VehicleName = ticket.Transportation.Vehicle.Name,
                        Order = count++,
                        ExpiredDate = ticket.ExpiredDateTime,
                    };

                    routeSearchViewModel.TotalAmount += ticket.SellingPrice;
                    routeSearchViewModel.RouteTickets.Add(ticketModel);
                }

                routes.Add(routeSearchViewModel);
            }

            return routes;
        }

        public void UpdateRoute(RouteDetailViewModel model)
        {
            var route = _mapper.Map<RouteDetailViewModel, Route>(model);
            var routeTickets = _mapper.Map<List<RouteTicketDetailViewModel>, List<RouteTicket>>(model.RouteTickets);

            _routeRepository.UpdateNoTracking(route);
            foreach (var routeTicket in routeTickets)
            {
                _routeTicketRepository.UpdateNoTracking(routeTicket);
            }
        }

        /// <summary>
        /// Generate route code 
        /// Format: RTC-######
        /// </summary>
        /// <returns></returns>
        protected string GenerateRouteCode()
        {
            const int MAX_ROUTE_COUNT = 1000000;

            var routeCount = _routeRepository.GetAllQueryable().Count();
            routeCount = (routeCount % MAX_ROUTE_COUNT) + 1;

            return $"RTC-{routeCount.ToString("D6")}";
        }

        public void UpdateRouteTicket(RouteTicketUpdateParams paramsModel)
        {
            var currentRouteTicket = _routeTicketRepository.Get(x =>
                x.Deleted == false &&
                x.Id == paramsModel.RouteTicketId
            );

            if (currentRouteTicket == null) throw new NotFoundException();

            var newTicket = _ticketRepository.Get(x =>
                x.Deleted == false &&
                x.Status == TicketStatus.Valid &&
                x.Id == paramsModel.NewTicketId &&
                x.Id != currentRouteTicket.TicketId
            );

            if (newTicket == null) throw new NotFoundException();

            if (CheckBeforeUpdateRouteTicket(currentRouteTicket, newTicket) == false)
                throw new InvalidOperationException();

            currentRouteTicket.TicketId = newTicket.Id;
            currentRouteTicket.DepartureStationId = newTicket.DepartureStationId;
            currentRouteTicket.ArrivalStationId = newTicket.ArrivalStationId;


            //Update total amount for route
            var route = _routeRepository.Get(x => x.Deleted == false && x.Id == currentRouteTicket.RouteId);
            if (route == null) throw new NotFoundException();

            //Begin update into database
            _unitOfWork.StartTransaction();
            _routeTicketRepository.Update(currentRouteTicket);
            _unitOfWork.CommitChanges();

            route.TotalAmount = _routeTicketRepository.GetAllQueryable()
                .Where(x => x.Deleted == false &&
                    x.RouteId == route.Id
                )
                .Sum(x => x.Ticket.SellingPrice);
            _routeRepository.Update(route);

            _unitOfWork.CommitTransaction();
        }

        /// <summary>
        /// Check departure time and arrival time critical for new Ticket
        /// </summary>
        /// <param name="currentRouteTicket">Old Route Ticket</param>
        /// <param name="newTicket">New Ticket</param>
        /// <returns></returns>
        public bool CheckBeforeUpdateRouteTicket(RouteTicket currentRouteTicket, Ticket newTicket)
        {
            var previousRouteTicket = _routeTicketRepository.Get(x =>
                x.Deleted == false &&
                x.RouteId == currentRouteTicket.RouteId &&
                x.Order == currentRouteTicket.Order - 1
            );

            var nextRouteTicket = _routeTicketRepository.Get(x =>
                x.Deleted == false &&
                x.RouteId == currentRouteTicket.RouteId &&
                x.Order == currentRouteTicket.Order + 1
            );

            DateTime? minDepartureDate = previousRouteTicket?.Ticket?.ArrivalDateTime;
            DateTime? maxArrivalDate = nextRouteTicket?.Ticket?.DepartureDateTime;

            if ((minDepartureDate != null && minDepartureDate > newTicket.DepartureDateTime) ||
                (maxArrivalDate != null && maxArrivalDate < newTicket.ArrivalDateTime))
            {
                return false;
            }

            return true;
        }

        public string BuyRoute(BuyRouteParams model, string username)
        {
            //var concurrencyCode = Guid.NewGuid().ToString();
            var existedRoute = _routeRepository.Get(x => x.Id == model.RouteId && x.Deleted == false);
            if (existedRoute == null)
            {
                return "Not found route";
            }
            if (existedRoute.Status != RouteStatus.New)
            {
                return "This Route has been bought.";
            }
            if (existedRoute.Status == RouteStatus.New)
            {
                var routeTickets = _routeTicketRepository.GetAllQueryable()
                .Where(t => t.Deleted == false && t.RouteId == existedRoute.Id).ToList();
                var tickets = new List<Ticket>();
                //var ticketList = _ticketRepository.GetAll();
                foreach (var routeTicket in routeTickets)
                {
                    tickets.Add(routeTicket.Ticket);
                }

                var count = 0;
                foreach (var ticket in tickets)
                {
                    if (ticket.Status == TicketStatus.Valid)
                    {
                        count++;
                    }
                    else
                    {
                        return "The ticket " + ticket.TicketCode + " has been bought.";
                    }

                }
                if (count == tickets.Count())
                {
                    //_unitOfWork.StartTransaction();
                    existedRoute.CustomerId = _customerRepository.Get(c => c.Username.Equals(username) && c.Deleted == false && c.IsActive == true).Id;
                    foreach (var ticket in tickets)
                    {
                        ticket.BuyerPassengerIdentify = model.BuyerPassengerIdentify;
                        ticket.BuyerPassengerName = model.BuyerPassengerName;
                        ticket.BuyerPassengerEmail = model.BuyerPassengerEmail;
                        ticket.BuyerPassengerPhone = model.BuyerPassengerPhone;
                        ticket.BuyerId = existedRoute.CustomerId;
                        ticket.Status = TicketStatus.Bought;
                        //ticket.ConcurrencyCheck = concurrencyCode;
                        _ticketRepository.Update(ticket);
                    }
                    existedRoute.Status = RouteStatus.Bought;
                    _routeRepository.Update(existedRoute);
                }
                else
                {
                    throw new InvalidOperationException();
                }

                _unitOfWork.CommitChanges();

                //push noti for seller customer
                foreach (var ticket in tickets)
                {
                    var message = "Ticket " + ticket.TicketCode + " has been bought. Please change this ticket information to finish the selling process.";
                    var customerDevices = ticket.Seller.CustomerDevices.Where(x => x.IsLogout == false).ToList();
                    List<string> deviceIds = new List<string>();
                    foreach (var cusDev in customerDevices)
                    {
                        deviceIds.Add(cusDev.DeviceId);
                    }

                    //Save Notification into db
                    _notificationService.SaveNotification(
                        customerId: ticket.Seller.Id,
                        type: NotificationType.TicketIsBought,
                        message: $"Your ticket {ticket.TicketCode} has been bought. Please change this ticket information to finish the selling process.",
                        data: new { ticketId = ticket.Id }
                    );

                    _oneSignalService.PushNotificationCustomer(message, deviceIds);
                }
            }
            else
            {
                return "This Route has been bought.";
            }
            return string.Empty;
        }

        public RouteDataTable GetLiabilityRoutes(string param, int page, int pageSize)
        {
            param = param ?? "";

            var routeVMs =
                (from ROUTE in _routeRepository.GetAllQueryable()

                 join ROUTETICKET in _routeTicketRepository.GetAllQueryable()
                 on ROUTE.Id equals ROUTETICKET.RouteId

                 where
                     ROUTE.Deleted == false &&
                     ROUTETICKET.Deleted == false &&
                     ROUTETICKET.Ticket.Deleted == false &&
                     ROUTE.Status == RouteStatus.Bought &&
                     (ROUTETICKET.Ticket.Status == TicketStatus.RenamedSuccess || ROUTETICKET.Ticket.Status == TicketStatus.RenamedFail) &&
                     ROUTE.Code.ToLower().Contains(param.ToLower())

                 select new RouteRowViewModel()
                 {
                     Id = ROUTE.Id,
                     Code = ROUTE.Code,
                     CreatedAt = ROUTE.CreatedAtUTC,
                     CustomerId = ROUTE.CustomerId,
                     Status = ROUTE.Status,
                     TotalAmount = ROUTE.TotalAmount,
                     TicketQuantity = ROUTE.RouteTickets.Count(x => x.Deleted == false),
                     IsLiability = true
                 }).Distinct();

            var routeOrderedVMs = routeVMs.OrderByDescending(x => x.Id);
            var routePagedVMs = routeOrderedVMs.Skip((page - 1) * pageSize).Take(pageSize);


            var routeDataTable = new RouteDataTable()
            {
                Data = routePagedVMs.ToList(),
                Total = routeVMs.Count()
            };

            foreach (var route in routeDataTable.Data)
            {
                var routeTickets = _routeTicketRepository.GetAllQueryable().Where(x =>
                    x.RouteId == route.Id &&
                    x.Deleted == false
                ).OrderBy(x => x.Order);

                var firstRouteTicket = routeTickets.FirstOrDefault();
                route.DepartureCityName = firstRouteTicket.DepartureStation.City.Name;
                route.DepartureDate = firstRouteTicket.Ticket.DepartureDateTime;

                var lastRouteTicket = routeTickets.LastOrDefault();
                route.ArrivalCityName = lastRouteTicket.ArrivalStation.City.Name;
                route.ArrivalDate = lastRouteTicket.Ticket.ArrivalDateTime;
            }

            return routeDataTable;
        }

        public RouteDataTable GetBoughtRoutes(string param, int page, int pageSize)
        {
            param = param ?? "";
            var routeVMs =
                (from ROUTE in _routeRepository.GetAllQueryable()

                 join ROUTETICKET in _routeTicketRepository.GetAllQueryable()
                 on ROUTE.Id equals ROUTETICKET.RouteId

                 where
                     ROUTE.Deleted == false &&
                     ROUTETICKET.Deleted == false &&
                     ROUTETICKET.Ticket.Deleted == false &&
                     ROUTE.Status == RouteStatus.Bought &&
                     //(ROUTETICKET.Ticket.Status != TicketStatus.RenamedSuccess && ROUTETICKET.Ticket.Status != TicketStatus.RenamedFail) &&
                     ROUTE.Code.ToLower().Contains(param.ToLower())
                 orderby ROUTE.UpdatedAtUTC ?? ROUTE.CreatedAtUTC descending

                 select new RouteRowViewModel()
                 {
                     Id = ROUTE.Id,
                     Code = ROUTE.Code,
                     CreatedAt = ROUTE.CreatedAtUTC,
                     CustomerId = ROUTE.CustomerId,
                     Status = ROUTE.Status,
                     TotalAmount = ROUTE.TotalAmount,
                     TicketQuantity = ROUTE.RouteTickets.Count(x => x.Deleted == false),
                     IsLiability = false
                 }).Distinct().ToList();

            foreach (var routeVM in routeVMs)
            {
                var resolveOptionLogs = _resolveOptionLogRepository.GetAllQueryable().Where(x => x.RouteId == routeVM.Id && x.Option == ResolveOption.REPLACE);
                foreach (var log in resolveOptionLogs)
                {
                        routeVM.TotalAmount += log.Amount;
                }
                var routeTickets = _routeRepository.Get(x => x.Id == routeVM.Id).RouteTickets;
                foreach (var rt in routeTickets)
                {
                    if (_resolveOptionLogRepository.Get(x => x.RouteId == rt.RouteId && x.TicketId == rt.TicketId) == null)
                    {
                        if (rt.Ticket.Status == TicketStatus.RenamedSuccess || rt.Ticket.Status == TicketStatus.RenamedFail)
                        {
                            routeVM.IsLiability = true;
                            break;
                        }
                    }
                }
            }

            var routeOrderedVMs = routeVMs.OrderByDescending(x => x.IsLiability);
            var routePagedVMs = routeOrderedVMs.Skip((page - 1) * pageSize).Take(pageSize);

            var routeDataTable = new RouteDataTable()
            {
                Data = routePagedVMs.ToList(),
                Total = routeVMs.Count()
            };

            foreach (var route in routeDataTable.Data)
            {
                var routeTickets = _routeTicketRepository.GetAllQueryable().Where(x =>
                    x.RouteId == route.Id &&
                    x.IsReplaced != true
                ).OrderBy(x => x.Order);

                var firstRouteTicket = routeTickets.FirstOrDefault();
                route.DepartureCityName = firstRouteTicket.DepartureStation.City.Name;
                route.DepartureDate = firstRouteTicket.Ticket.DepartureDateTime;

                var lastRouteTicket = routeTickets.LastOrDefault();
                route.ArrivalCityName = lastRouteTicket.ArrivalStation.City.Name;
                route.ArrivalDate = lastRouteTicket.Ticket.ArrivalDateTime;
            }

            return routeDataTable;
        }

        public RouteDataTable GetCompletedRoutes(string param, int page, int pageSize)
        {
            param = param ?? "";
            var routeVMs =
                (from ROUTE in _routeRepository.GetAllQueryable()

                 join ROUTETICKET in _routeTicketRepository.GetAllQueryable()
                 on ROUTE.Id equals ROUTETICKET.RouteId

                 where
                     //ROUTE.Deleted == false &&
                     //ROUTETICKET.Deleted == false &&
                     //ROUTETICKET.Ticket.Deleted == false &&
                     ROUTE.Status == RouteStatus.Completed &&
                     ROUTE.Code.ToLower().Contains(param.ToLower())
                 //orderby
                 //   ROUTE.UpdatedAtUTC ?? ROUTE.CreatedAtUTC descending

                 select new RouteRowViewModel()
                 {
                     Id = ROUTE.Id,
                     Code = ROUTE.Code,
                     CreatedAt = ROUTE.CreatedAtUTC,
                     UpdateAt = ROUTE.UpdatedAtUTC ?? ROUTE.CreatedAtUTC,
                     CustomerId = ROUTE.CustomerId,
                     Status = ROUTE.Status,
                     TotalAmount = ROUTE.TotalAmount,
                     TicketQuantity = ROUTE.RouteTickets.Count(x => x.Deleted == false),
                 }).Distinct();

            var routeOrderedVMs = routeVMs.OrderByDescending(x => x.UpdateAt);
            var routePagedVMs = routeOrderedVMs.Skip((page - 1) * pageSize).Take(pageSize);


            var routeDataTable = new RouteDataTable()
            {
                Data = routePagedVMs.ToList(),
                Total = routeVMs.Count()
            };

            foreach (var route in routeDataTable.Data)
            {
                //route.EarnedLoss = route.TotalAmount;
                var resolveOptionLogs = _resolveOptionLogRepository.GetAllQueryable().Where(x => x.RouteId == route.Id);
                foreach (var log in resolveOptionLogs)
                {
                    //if (log.Option == ResolveOption.PAYOUT)
                    //{
                    //    route.EarnedLoss = route.EarnedLoss - log.Amount;
                    //}
                    //else
                    //{
                    //    route.EarnedLoss = route.EarnedLoss - log.Amount;
                    //}

                    if (log.Option == ResolveOption.REPLACE)
                    {
                        route.TotalAmount += log.Amount;
                    }
                    route.EarnedLoss += log.Amount;
                    //route.EarnedLoss -= log.Amount;
                }
                route.EarnedLoss = route.TotalAmount - route.EarnedLoss;
                var routeTickets = _routeTicketRepository.GetAllQueryable().Where(x =>
                    x.RouteId == route.Id &&
                    x.IsReplaced != true
                ).OrderBy(x => x.Order);

                var firstRouteTicket = routeTickets.FirstOrDefault();
                route.DepartureCityName = firstRouteTicket.DepartureStation.City.Name;
                route.DepartureDate = firstRouteTicket.Ticket.DepartureDateTime;

                var lastRouteTicket = routeTickets.LastOrDefault();
                route.ArrivalCityName = lastRouteTicket.ArrivalStation.City.Name;
                route.ArrivalDate = lastRouteTicket.Ticket.ArrivalDateTime;
            }

            return routeDataTable;
        }

        public void ReplaceOneFailTicket(int routeId, int failRouteTicketId, int replaceTicketId, string username) //lower price
        {
            var staffId = _userRepository.Get(x => x.UserName == username).Id;
            var failRouteTicket = _routeTicketRepository.Get(x => x.Id == failRouteTicketId && x.Deleted == false);
            var replaceTicket = _ticketRepository.Get(x => x.Deleted == false && x.Id == replaceTicketId);
            if(replaceTicket.Status != TicketStatus.Valid)
            {
                throw new InvalidOperationException();
            }
            RouteTicket replaceRouteTicket = new RouteTicket()
            {
                Id = 0,
                RouteId = routeId,
                TicketId = replaceTicketId,
                DepartureStationId = replaceTicket.DepartureStationId,
                ArrivalStationId = replaceTicket.ArrivalStationId,
                Order = failRouteTicket.Order
            };
            failRouteTicket.IsReplaced = true;
            _routeTicketRepository.Update(failRouteTicket);
            _routeTicketRepository.Add(replaceRouteTicket);

            replaceTicket.Status = TicketStatus.Bought;
            replaceTicket.BuyerPassengerName = failRouteTicket.Ticket.BuyerPassengerName;
            replaceTicket.BuyerPassengerEmail = failRouteTicket.Ticket.BuyerPassengerEmail;
            replaceTicket.BuyerPassengerPhone = failRouteTicket.Ticket.BuyerPassengerPhone;
            replaceTicket.BuyerPassengerIdentify = failRouteTicket.Ticket.BuyerPassengerIdentify;
            replaceTicket.BuyerId = failRouteTicket.Ticket.BuyerId;
            _ticketRepository.Update(replaceTicket);
            _unitOfWork.StartTransaction();
            _unitOfWork.CommitChanges();

            //hoàn 1 phần tiền 
            decimal failTicketPrice = failRouteTicket.Ticket.SellingPrice;
            decimal replaceTicketPrice = replaceTicket.SellingPrice;
            //lấy Lịch sử chagre tiền
            var paymentDetail = _paymentRepository.Get(x => x.RouteId == routeId && x.Route.Deleted == false);
            //if (replaceTicketPrice <= failTicketPrice)
            //{
            var amount = failTicketPrice - replaceTicketPrice;
            RefundAfterReplaceTicket(amount, paymentDetail, failRouteTicket.Route.Code, failRouteTicket.Ticket.TicketCode, replaceTicket.TicketCode);
            //Update lại total Amount of route và payment
            var route = failRouteTicket.Route;
            //route.ResolveOption = ResolveOption.REPLACE;
            route.TotalAmount = route.TotalAmount - (failTicketPrice - replaceTicketPrice);
            _routeRepository.Update(route);

            ResolveOptionLog resolveOptionLog = new ResolveOptionLog()
            {
                RouteId = routeId,
                TicketId = failRouteTicket.TicketId,
                Option = ResolveOption.REPLACE,
                StaffId = staffId,
                ReplacedTicketCode = replaceTicket.TicketCode,
                Amount = amount
            };
            _resolveOptionLogRepository.Add(resolveOptionLog);
            //}

            //_unitOfWork.CommitChanges();
            _unitOfWork.CommitTransaction();

            //push noti to seller
            var message = "Ticket " + replaceTicket.TicketCode + " has been bought. Please change this ticket information to finish the selling process.";
            var sellerDevices = replaceTicket.Seller.CustomerDevices.Where(x => x.IsLogout == false);
            List<string> sellerDeviceIds = new List<string>();
            foreach (var sellerDev in sellerDevices)
            {
                sellerDeviceIds.Add(sellerDev.DeviceId);
            }

            _oneSignalService.PushNotificationCustomer(message, sellerDeviceIds);

            _notificationService.SaveNotification(
                customerId: replaceTicket.SellerId,
                type: NotificationType.TicketIsBought,
                message: $"Your ticket {replaceTicket.TicketCode} has been bought. Please change this ticket information to finish the selling process."
            );

            //push noti to buyer
            message = "Ticket " + failRouteTicket.Ticket.TicketCode + " is replaced by Ticket " + replaceTicket.TicketCode + ". $" +
                amount.ToString("N2") + " will be refunded within next 5 to 7 working days.";
            var buyerDevices = failRouteTicket.Ticket.Buyer.CustomerDevices.Where(x => x.IsLogout == false);
            List<string> buyerDeviceIds = new List<string>();
            foreach (var buyerDev in buyerDevices)
            {
                buyerDeviceIds.Add(buyerDev.DeviceId);
            }
            _oneSignalService.PushNotificationCustomer(message, buyerDeviceIds);

            //Save Notification
            if(replaceTicket.BuyerId != null)
            {
                _notificationService.SaveNotification(
                    customerId: replaceTicket.BuyerId.Value,
                    type: NotificationType.RouteIsRefundReplaceTicket,
                    message: $"Tikcet {failRouteTicket.Ticket.TicketCode} in Route {failRouteTicket.Route.Code} is replaced by Ticket {replaceTicket.TicketCode}. " +
                        $"${amount.ToString("N2")} will be refunded within next 5 to 7 working days.",
                    data: new { routeId = failRouteTicket.RouteId }
                );
            }

            _sendGridService.SendEmailReplacementForBuyer(failRouteTicket.TicketId, replaceTicketId);
        }

        public void RefundAfterReplaceTicket(decimal amount, Payment payment, string routeCode,string codeFaill, string codeReplace)
        {
            //refund lại tiền
            StripeConfiguration.SetApiKey(SETTING.Value.SecretStripe);

            var refundOptions = new RefundCreateOptions()
            {
                ChargeId = payment.StripeChargeId,
                Amount = Convert.ToInt64(amount * 100)
            };
            var refundService = new Stripe.RefundService();
            Stripe.Refund refund = refundService.Create(refundOptions);
            Core.Models.Refund refundAddIntoData = new Core.Models.Refund();
            refundAddIntoData.PaymentId = payment.Id;
            refundAddIntoData.StripeRefundId = refund.Id;
            refundAddIntoData.Amount = amount;
            refundAddIntoData.Description = "Ticket " + codeFaill + " in Route " + routeCode + " is replaced by Ticket " + 
                codeReplace + ". We sorry for the inconvenience.";
            refundAddIntoData.Status = RefundStatus.Success;
            _refundRepository.Add(refundAddIntoData);
            //
        }

        public StatisticReportViewModel GetStatisticReport()
        {
            var statisticReport = new StatisticReportViewModel();
            var availableTicketCount = _ticketRepository.GetAllQueryable()
                .Where(x => x.Deleted == false && x.Status == TicketStatus.Valid).Count();
            var completedTicketCount = _ticketRepository.GetAllQueryable()
                .Where(x => x.Status == TicketStatus.Completed).Count();
            var completedRoutes = _routeRepository.GetAllQueryable()
                .Where(x => x.Status == RouteStatus.Completed);

            statisticReport.BalanceAccount = 0;
            foreach (var route in completedRoutes)
            {
                statisticReport.BalanceAccount += route.TotalAmount;
                var resolveOptionLogs = _resolveOptionLogRepository.GetAllQueryable().Where(x => x.RouteId == route.Id);
                foreach (var log in resolveOptionLogs)
                {
                    if(log.Option == ResolveOption.REPLACE)
                    {
                        statisticReport.BalanceAccount += log.Amount;
                    }
                    statisticReport.BalanceAccount -= log.Amount;
                }
            }
            statisticReport.AvailableTicketCount = availableTicketCount;
            statisticReport.CompletedTicketCount = completedTicketCount;
            statisticReport.CompletedRouteCount = completedRoutes.Count();
            return statisticReport;
        }
    }
}
