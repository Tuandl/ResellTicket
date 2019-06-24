using Algorithm.KShortestPaths;
using Algorithm.KShortestPaths.Models;
using AutoMapper;
using Core.Enum;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using ViewModel.ErrorViewModel;
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
        /// <returns>List search results.</returns>
        List<RouteSearchViewModel> SearchRoute(int departureCityId, int arrivalCityId,
            DateTime departureDate, int page, int pageSize, int maxCombinationTickets = 3);

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

        /// <summary>
        /// Get Route data table for display in List
        /// </summary>
        /// <param name="page">required. page number start at 1.</param>
        /// <param name="pageSize">required. page size</param>
        /// <param name="status">optional. Status of routes</param>
        /// <returns>Route data table (route information and tickets in that route</returns>
        RouteDataTable GetRouteDataTable(int page, int pageSize, 
            RouteStatus? status, string userName);

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
    }

    public class RouteService : IRouteService
    {
        private readonly IRouteRepository _routeRepository;
        private readonly IRouteTicketRepository _routeTicketRepository;
        private readonly ICityRepository _cityRepository;
        private readonly ITicketRepository _ticketRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public RouteService(
                IRouteRepository routeRepository,
                IRouteTicketRepository routeTicketRepository,
                ITicketRepository ticketRepository,
                ICityRepository cityRepository,
                ICustomerRepository customerRepository,
                IUnitOfWork unitOfWork,
                IMapper mapper
            )
        {
            _routeRepository = routeRepository;
            _routeTicketRepository = routeTicketRepository;
            _ticketRepository = ticketRepository;
            _cityRepository = cityRepository;
            _customerRepository = customerRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public void DeleteRoute(int routeId)
        {
            var route = _routeRepository.Get(x => x.Id == routeId);
            if(route != null)
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

            if(customer == null) 
                throw new NotFoundException();

            //Get route view models
            var routes = _routeRepository.GetAllQueryable()
                .Where(x => x.Deleted == false)
                .Select(x => new RouteRowViewModel()
                {
                    Id = x.Id,
                    Code = x.Code,
                    CreatedAt = x.CreatedAt,
                    CustomerId = x.CustomerId,
                    Status = x.Status,
                    TotalAmount = x.TotalAmount,
                    TicketQuantity = x.RouteTickets.Count(),
                    //Check valid or not depen on ticket status
                    IsValid = !x.RouteTickets.Any(routeTicket => routeTicket.Ticket.Status != TicketStatus.Valid),
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
                    x.Deleted == false
                ).OrderBy(x => x.Order);

                var firstRouteTicket = routeTickets.FirstOrDefault();
                route.DepartureCityName = firstRouteTicket.DepartureStation.City.Name;
                route.DepartureDate = firstRouteTicket.Ticket.DepartureDateTime;

                var lastRouteTicket = routeTickets.LastOrDefault();
                route.ArrivalCityName = lastRouteTicket.ArrivalStation.City.Name;
                route.ArrivalDate = lastRouteTicket.Ticket.ArrivalDateTime;
            }

            return result;
        }

        public RouteDetailViewModel GetRouteDetail(int routeId)
        {
            var route = _routeRepository.Get(x => 
                x.Deleted == false &&
                x.Id == routeId
            );

            if(route == null)
            {
                throw new NotFoundException();
            }

            var routeViewModel = _mapper.Map<Route, RouteDetailViewModel>(route);
            routeViewModel.RouteTickets = new List<RouteTicketDetailViewModel>();

            //Parse route ticket into viewmodel
            foreach (var routeTicket in route.RouteTickets)
            {
                var routeTicketViewModel = _mapper.Map<RouteTicket, RouteTicketDetailViewModel>(routeTicket);

                routeViewModel.RouteTickets.Add(routeTicketViewModel);
            }

            return routeViewModel;
        }

        public int AddRoute(RouteSearchViewModel model, string customerUserName)
        {
            var customer = _customerRepository.Get(x => 
                x.Username == customerUserName &&
                x.Deleted == false
            );

            if(customer == null)
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
            DateTime departureDate, int page, int pageSize, int maxCombinationTickets = 3)
        {
            //Get raw available tickets in db
            var tickets = _ticketRepository.GetAllQueryable()
                .Where(x => 
                    x.Status == Core.Enum.TicketStatus.Valid &&
                    x.Deleted == false &&
                    x.DepartureDateTime >= departureDate
                );


            //create graph base on available tickets
            var graph = new EppsteinGraph();
            foreach (var ticket in tickets)
            {
                graph.CreateEdgeFromTicketBaseOnPrice(ticket);
            }

            //Calculate k shortest paths
            graph.BuildKthShortestPaths(
                departureId: departureCityId, 
                destinationId: arrivalCityId, 
                maxCombination: maxCombinationTickets,
                kshortestPathQuantity: page * pageSize
            );

            //Get k shortest path
            var paths = new List<Path>();
            for(int count = (page - 1) * pageSize; count < page * pageSize; count++)
            {
                var path = graph.FindNextShortestPath().Trim();
                if(!path.IsValid) 
                    break;
                paths.Add(path);
            }

            var routes = new List<RouteSearchViewModel>();
            foreach (var path in paths.Skip((page - 1) * pageSize))
            {
                var routeSearchViewModel = new RouteSearchViewModel();

                int count = 0;
                foreach (var edge in path)
                {
                    var ticket = edge.Tail.Data as Ticket;
                    var ticketModel = new RouteTicketSearchViewModel()
                    {
                        TicketId = ticket.Id,
                        ArrivalCityId = arrivalCityId,
                        ArrivalCityName = ticket.ArrivalStation.City.Name,
                        ArrivalStationId = ticket.ArrivalStationId,
                        ArrivalStationName = ticket.ArrivalStation.Name,
                        ArrivalDateTime = ticket.ArrivalDateTime,
                        DepartureCityId = departureCityId,
                        DepartureCityName = ticket.DepartureStation.City.Name,
                        DepartureStationId = ticket.DepartureStationId,
                        DepartureStationName = ticket.DepartureStation.Name,
                        DepartureDateTime = ticket.DepartureDateTime,
                        TransportationName = ticket.Transportation.Name,
                        VehicleName = ticket.Transportation.Vehicle.Name,
                        Order = count++,
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

            if(currentRouteTicket == null) throw new NotFoundException();

            var newTicket = _ticketRepository.Get(x =>
                x.Deleted == false &&
                x.Status == TicketStatus.Valid &&
                x.Id == paramsModel.NewTicketId &&
                x.Id != currentRouteTicket.TicketId
            );

            if(newTicket == null) throw new NotFoundException();

            if(CheckBeforeUpdateRouteTicket(currentRouteTicket, newTicket) == false)
                throw new InvalidOperationException();
            
            currentRouteTicket.TicketId = newTicket.Id;
            currentRouteTicket.DepartureStationId = newTicket.DepartureStationId;
            currentRouteTicket.ArrivalStationId = newTicket.ArrivalStationId;


            //Update total amount for route
            var route = _routeRepository.Get(x => x.Deleted == false && x.Id == currentRouteTicket.RouteId);
            if(route == null) throw new NotFoundException();

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
            var existedRoute = _routeRepository.Get(x => x.Id == model.RouteId);
            if (existedRoute == null)
            {
                return "Not found route";
            }
            if(existedRoute.Status == RouteStatus.New)
            {
                var routeTickets = _routeTicketRepository.GetAllQueryable()
                .Where(t => t.RouteId == existedRoute.Id).ToList();
                var tickets = new List<Ticket>();
                var ticketList = _ticketRepository.GetAll();
                foreach (var routeTicket in routeTickets)
                {
                    foreach(var ticket in ticketList)
                    {
                        if(ticket.Id == routeTicket.TicketId)
                        {
                            tickets.Add(ticket);
                        }
                    }
                }
                
                var count = 0;
                foreach (var ticket in tickets)
                {
                    if (ticket.Status == TicketStatus.Valid)
                    {
                        count++;
                    }
                }
                if (count == tickets.Count())
                {
                    existedRoute.CustomerId = _customerRepository.Get(c => c.Username.Equals(username)).Id;
                    foreach (var ticket in tickets)
                    {
                        ticket.BuyerId = existedRoute.CustomerId;
                        ticket.Status = TicketStatus.Bought;
                        _ticketRepository.Update(ticket);
                    }
                    existedRoute.Status = RouteStatus.Bought;
                    _routeRepository.Update(existedRoute);
                } 
                else
                {
                    throw new InvalidOperationException();
                }
                try
                {
                    _unitOfWork.CommitChanges();
                }
                catch (Exception ex)
                {
                    return ex.Message;
                }
            }
            return string.Empty;
        }
    }
}
