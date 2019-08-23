using AutoMapper;
using Core.Enum;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using Microsoft.AspNetCore.Identity;
using Service.Helpers;
using Service.NotificationService;
using System;
using System.Collections.Generic;
using System.Linq;
using ViewModel.ErrorViewModel;
using ViewModel.ViewModel.Ticket;

namespace Service.Services
{
    public interface ITicketService
    {
        List<TicketRowViewModel> GetTickets();

        //getTicketsPendingStatus
        TicketDataTable GetPendingTickets(string param, int page, int pageSize);
        //getTicketsValidStatus
        TicketDataTable GetValidTickets(string param, int page, int pageSize);
        //getTicketsInValidStatus
        TicketDataTable GetInValidTickets(string param, int page, int pageSize);
        List<TicketRowViewModel> GetTickets(string param);
        //getTicketsRenameddStatus
        TicketDataTable GetRenamedTickets(string param, int page, int pageSize);
        //getTicketsBoughtStatus
        TicketDataTable GetBoughtTickets(string param, int page, int pageSize);
        //getTicketsCompletedStatus
        TicketDataTable GetCompletedTickets(string param, int page, int pageSize);
        string ApproveTicket(int id, decimal commissionFee, DateTime expiredDatetime);
        string RejectTicket(int id, string invalidField);
        int PostTicket(string username, TicketPostViewModel model);
        void EditTicket(TicketEditViewModel model);
        void DeleteTicket(int ticketId);
        List<CustomerTicketViewModel> GetCustomerTickets(string username, int page, int pageSize, TicketStatus? status);
        TicketDetailViewModel GetTicketDetail(int ticketId);
        string ConfirmRenameTicket(int id);
        string ValidateRenameTicket(int id, bool renameSuccess);
        string RefuseTicket(int id);
        void setRenamedFailBoughtTicket(int id);

        /// <summary>
        /// Get Tickets available for editing a route ticket
        /// </summary>
        /// <param name="routeId"></param>
        /// <returns></returns>
        List<AvailableTicketViewModel> GetTicketAvailableForRouteTicket(int routeTicketId);

        /// <summary>
        /// Get tickets replace for renamed fail ticket
        /// WEB ADMIN
        /// </summary>
        /// <param name="failRouteTicketId"></param>
        /// <returns></returns>
        AvailableTicketDataTable GetReplaceTicketForOneFailTicket(int failRouteTicketId, int page, int pageSize);
        TicketDataTable GetReplaceTickets(int routeTicketId);
    }
    public class TicketService : ITicketService
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ITicketRepository _ticketRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly IStationRepository _stationRepository;
        private readonly IRouteTicketRepository _routeTicketRepository;
        private readonly IOneSignalService _oneSignalService;
        private readonly UserManager<User> _userManager;
        private readonly IAdminDeviceRepository _adminDeviceRepository;
        private readonly INotificationService _notificationService;

        public TicketService(IMapper mapper,
                             IUnitOfWork unitOfWork,
                             ITicketRepository ticketRepository,
                             ICustomerRepository customerRepository,
                             IStationRepository stationRepository,
                             IRouteTicketRepository routeTicketRepository,
                             ICustomerDeviceRepository customerDeviceRepository,
                             IOneSignalService oneSignalService,
                             UserManager<User> userManager,
                             IAdminDeviceRepository adminDeviceRepository,
                             INotificationService notificationService
        )
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _ticketRepository = ticketRepository;
            _customerRepository = customerRepository;
            _stationRepository = stationRepository;
            _routeTicketRepository = routeTicketRepository;
            _oneSignalService = oneSignalService;
            _userManager = userManager;
            _adminDeviceRepository = adminDeviceRepository;
            _notificationService = notificationService;
        }

        public List<TicketRowViewModel> GetTickets()
        {
            var tickets = _ticketRepository.GetAll().ToList();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(tickets);

            return ticketRowViewModels;
        }
        public TicketDetailViewModel GetTicketDetail(int ticketId)
        {
            var ticketDetail = _ticketRepository.Get(x => x.Id == ticketId);
            var ticketDetailVM = _mapper.Map<Ticket, TicketDetailViewModel>(ticketDetail);
            return ticketDetailVM;
        }

        public TicketDataTable GetPendingTickets(string param, int page, int pageSize)
        {
            param = param ?? "";
            var pendingTickets = _ticketRepository.GetAllQueryable()
                .Where(t => t.Deleted == false && t.DepartureDateTimeUTC >= DateTime.UtcNow)
                .Where(t => t.TicketCode.ToLower().Contains(param.ToLower()))
                .Where(t => t.Status == Core.Enum.TicketStatus.Pending)
                .Skip((page - 1) * pageSize).Take(pageSize)
                .ToList();
            var totalPendingTickets = _ticketRepository.GetAllQueryable()
                .Where(t => t.Deleted == false)
                .Where(t => t.TicketCode.ToLower().Contains(param.ToLower()))
                .Where(t => t.Status == Core.Enum.TicketStatus.Pending).Count();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(pendingTickets);

            var ticketDataTable = new TicketDataTable()
            {
                Data = ticketRowViewModels,
                Total = totalPendingTickets
            };

            return ticketDataTable;
        }

        public TicketDataTable GetValidTickets(string param, int page, int pageSize)
        {
            param = param ?? "";
            var validTickets = _ticketRepository.GetAllQueryable()
                 .Where(t => t.Deleted == false && t.ExpiredDateTimeUTC >= DateTime.UtcNow)
                .Where(t => t.TicketCode.ToLower().Contains(param.ToLower()))
                .Where(t => t.Status == Core.Enum.TicketStatus.Valid)
                .Skip((page - 1) * pageSize).Take(pageSize).ToList();
            var totalValidTickets = _ticketRepository.GetAllQueryable()
                 .Where(t => t.Deleted == false)
               .Where(t => t.TicketCode.ToLower().Contains(param.ToLower()))
               .Where(t => t.Status == Core.Enum.TicketStatus.Valid).Count();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(validTickets);

            var ticketDataTable = new TicketDataTable()
            {
                Data = ticketRowViewModels,
                Total = totalValidTickets
            };

            return ticketDataTable;
        }
        public TicketDataTable GetInValidTickets(string param, int page, int pageSize)
        {
            param = param ?? "";
            var invalidTickets = _ticketRepository.GetAllQueryable()
                .Where(t => t.Deleted == false)
                .Where(t => t.TicketCode.ToLower().Contains(param.ToLower()))
                .Where(t => t.Status == Core.Enum.TicketStatus.Invalid)
                .Skip((page - 1) * pageSize).Take(pageSize).ToList();

            var totalInvalidTickets = _ticketRepository.GetAllQueryable()
                .Where(t => t.Deleted == false)
                .Where(t => t.TicketCode.ToLower().Contains(param.ToLower()))
                .Where(t => t.Status == Core.Enum.TicketStatus.Invalid).Count();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(invalidTickets);

            var ticketDataTable = new TicketDataTable()
            {
                Data = ticketRowViewModels,
                Total = totalInvalidTickets
            };
            return ticketDataTable;
        }

        public TicketDataTable GetRenamedTickets(string param, int page, int pageSize)
        {
            param = param ?? "";
            var renamedTickets = _ticketRepository.GetAllQueryable()
                .Where(t => t.Deleted == false)
                .Where(t => t.TicketCode.ToLower().Contains(param.ToLower()))
                .Where(t => t.Status == Core.Enum.TicketStatus.Renamed)
                .Skip((page - 1) * pageSize).Take(pageSize).ToList();

            var totalRenamedTickets = _ticketRepository.GetAllQueryable()
                .Where(t => t.Deleted == false)
                .Where(t => t.TicketCode.ToLower().Contains(param.ToLower()))
                .Where(t => t.Status == Core.Enum.TicketStatus.Renamed).Count();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(renamedTickets);

            var ticketDataTable = new TicketDataTable()
            {
                Data = ticketRowViewModels,
                Total = totalRenamedTickets
            };
            return ticketDataTable;
        }

        public TicketDataTable GetBoughtTickets(string param, int page, int pageSize)
        {
            param = param ?? "";
            var boughtTickets = _ticketRepository.GetAllQueryable()
                .Where(t => t.Deleted == false)
                .Where(t => t.TicketCode.ToLower().Contains(param.ToLower()))
                .Where(t => t.Status == Core.Enum.TicketStatus.Bought)
                .Skip((page - 1) * pageSize).Take(pageSize).ToList();
            foreach(var bt in boughtTickets)
            {
                if(bt.ExpiredDateTimeUTC <= DateTime.UtcNow)
                {
                    bt.Status = 0;
                }
            }
            var totalBoughtTickets = _ticketRepository.GetAllQueryable()
                .Where(t => t.Deleted == false)
                .Where(t => t.TicketCode.ToLower().Contains(param.ToLower()))
                .Where(t => t.Status == Core.Enum.TicketStatus.Bought).Count();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(boughtTickets);

            var ticketDataTable = new TicketDataTable()
            {
                Data = ticketRowViewModels,
                Total = totalBoughtTickets
            };
            return ticketDataTable;
        }

        public TicketDataTable GetCompletedTickets(string param, int page, int pageSize)
        {
            param = param ?? "";
            var completedTickets = _ticketRepository.GetAllQueryable()
                .Where(t => t.TicketCode.ToLower().Contains(param.ToLower()))
                .Where(t => t.Status == TicketStatus.Completed || t.Status == TicketStatus.RenamedFail)
                .OrderByDescending(t => t.UpdatedAtUTC)
                .Skip((page - 1) * pageSize).Take(pageSize).ToList();
            var totalCompletedTickets = _ticketRepository.GetAllQueryable()
                .Where(t => t.TicketCode.ToLower().Contains(param.ToLower()))
                .Where(t => t.Status == TicketStatus.Completed || t.Status == TicketStatus.RenamedFail).Count();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(completedTickets);

            var ticketDataTable = new TicketDataTable()
            {
                Data = ticketRowViewModels,
                Total = totalCompletedTickets
            };
            return ticketDataTable;
        }

        public List<CustomerTicketViewModel> GetCustomerTickets(string username, int page, int pageSize, TicketStatus? status)
        {

            var existedCustomer = _customerRepository.Get(x => x.Username == username && x.Deleted == false);
            var customerTickets = _ticketRepository.GetAllQueryable()
                .Where(t => t.Deleted == false)
                .Where(t => t.SellerId == existedCustomer.Id)
                .OrderByDescending(t => t.UpdatedAtUTC ?? t.CreatedAtUTC);
            var customerStatusTickets = customerTickets.ToList();
            switch (status)
            {
                case TicketStatus.Bought:
                    customerStatusTickets = customerTickets.Where(x => x.Status == status).ToList();
                    break;
                case TicketStatus.Renamed:
                    customerStatusTickets = customerTickets.Where(x => x.Status == status || x.Status == TicketStatus.RenamedSuccess).ToList();
                    break;
                case TicketStatus.Completed:
                    customerStatusTickets = customerTickets.Where(x => x.Status == status || x.Status == TicketStatus.RenamedFail).ToList();
                    break;
            }

            var customerPagedTickets = customerStatusTickets.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            foreach (var ticket in customerPagedTickets)
            {
                if (ticket.Status == TicketStatus.Valid)
                {
                    if (ticket.ExpiredDateTimeUTC < DateTime.UtcNow)
                    {
                        ticket.Status = 0;
                    }
                }
            }
            var customerTicketVMs = _mapper.Map<List<Ticket>, List<CustomerTicketViewModel>>(customerPagedTickets);

            return customerTicketVMs;
        }

        public List<TicketRowViewModel> GetTickets(string param)
        {
            param = param ?? "";
            var tickets = _ticketRepository.GetAllQueryable()
                         .Where(x => x.Deleted == false &&
                                x.TicketCode.ToLower().Contains(param.ToLower())).ToList();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(tickets);
            return ticketRowViewModels;
        }

        public List<TicketRowViewModel> GetInValidTickets()
        {
            var invalidTickets = _ticketRepository.GetAllQueryable().Where(t => t.Status == Core.Enum.TicketStatus.Invalid).ToList();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(invalidTickets);

            return ticketRowViewModels;
        }

        public int PostTicket(string username, TicketPostViewModel model)
        {
            var customerId = _customerRepository.Get(x => x.Username == username && x.Deleted == false).Id;
            var existedTicket = _ticketRepository.Get(x => x.TicketCode.ToLower().Equals(model.TicketCode.ToLower())
                                && x.TransportationId == model.TransportationId && x.TicketTypeId == model.TicketTypeId
                                && x.DepartureStationId == model.DepartureStationId && x.ArrivalStationId == model.ArrivalStationId
                                && DateTime.Equals(x.DepartureDateTime, model.DepartureDateTime) && DateTime.Equals(x.ArrivalDateTime, model.ArrivalDateTime));
            if (existedTicket != null && existedTicket.Status != TicketStatus.Invalid)
            {
                throw new InvalidOperationException();
            }
            var ticket = _mapper.Map<TicketPostViewModel, Ticket>(model);
            ticket.CommissionPercent = 10;
            ticket.Status = Core.Enum.TicketStatus.Pending;
            ticket.SellerId = customerId;
            ticket.ExpiredDateTime = model.DepartureDateTime;

            //convert time into UTC time
            var departureStation = _stationRepository.Get(x => x.Id == ticket.DepartureStationId && x.Deleted == false);
            if (departureStation.City.TimeZoneId != null)
            {
                ticket.DepartureDateTimeUTC = ticket.DepartureDateTime.ToSpecifiedTimeZone(departureStation.City.TimeZoneId);
                if (ticket.ExpiredDateTime != null)
                    ticket.ExpiredDateTimeUTC = ticket.ExpiredDateTime.Value.ToSpecifiedTimeZone(departureStation.City.TimeZoneId);
            }
            else
            {
                ticket.DepartureDateTimeUTC = ticket.DepartureDateTime;
                ticket.ExpiredDateTimeUTC = ticket.ExpiredDateTime;
            }

            var arrivalStation = _stationRepository.Get(x => x.Id == ticket.ArrivalStationId && x.Deleted == false);
            if (arrivalStation.City.TimeZoneId != null)
            {
                ticket.ArrivalDateTimeUTC = ticket.ArrivalDateTime.ToSpecifiedTimeZone(arrivalStation.City.TimeZoneId);
            }
            else
            {
                ticket.ArrivalDateTimeUTC = ticket.ArrivalDateTime;
            }

            _ticketRepository.Add(ticket);
            _unitOfWork.CommitChanges();

            //noti to staff
            List<string> adminDeviceIds = GetAdminDeviceIds();
            var message = "A new ticket is posted";
            _oneSignalService.PushNotificationAdmin(message, adminDeviceIds);
            return ticket.Id;
        }

        public void EditTicket(TicketEditViewModel model)
        {
            var existedTicket = _ticketRepository.Get(x => x.Id == model.Id && x.Deleted == false);
            if (existedTicket.Status != TicketStatus.Pending)
            {
                throw new InvalidOperationException();
            }
            EditInfoTicket(existedTicket, model);
            _ticketRepository.Update(existedTicket);
            _unitOfWork.CommitChanges();
        }

        public void DeleteTicket(int ticketId)
        {
            var existedTicket = _ticketRepository.Get(x => x.Deleted == false && x.Id == ticketId);
            existedTicket.Deleted = true;
            _ticketRepository.Update(existedTicket);
            _unitOfWork.CommitChanges();
        }

        public string ApproveTicket(int id, decimal commissionFee, DateTime expiredDateTime)
        {
            var existedTicket = _ticketRepository.Get(x => x.Deleted == false && x.Id == id);
            if (existedTicket == null)
            {
                return "Not found ticket";
            }
            if (existedTicket.Status != TicketStatus.Pending)
            {
                throw new InvalidOperationException();
            }

            existedTicket.Status = Core.Enum.TicketStatus.Valid;
            existedTicket.CommissionPercent = commissionFee;
            existedTicket.ExpiredDateTime = expiredDateTime;
            existedTicket.IsTicketCodeValid = true;
            existedTicket.IsVehicleValid = true;
            existedTicket.IsTransportationValid = true;
            existedTicket.IsTicketTypeValid = true;
            existedTicket.IsDepartureValid = true;
            existedTicket.IsArrivalValid = true;
            existedTicket.IsPassengerNameValid = true;
            existedTicket.IsEmailBookingValid = true;
            _ticketRepository.Update(existedTicket);

            _unitOfWork.CommitChanges();
            //try
            //{

            //}
            //catch (Exception ex)
            //{
            //    return ex.Message;
            //}
            var message = "Your ticket " + existedTicket.TicketCode + " is valid.";
            List<string> sellerDeviceIds = GetCustomerDeviceIds(existedTicket, true);

            //Save notification into db
            _notificationService.SaveNotification(
                customerId: existedTicket.SellerId,
                type: NotificationType.TicketIsValid,
                message: $"Your ticket {existedTicket.TicketCode} is valid.",
                data: new { ticketId = existedTicket.Id }
            );

            _oneSignalService.PushNotificationCustomer(message, sellerDeviceIds);

            return string.Empty;
        }

        public string RejectTicket(int id, string invalidField)
        {
            var existedTicket = _ticketRepository.Get(x => x.Deleted == false && x.Id == id);
            if (existedTicket == null)
            {
                return "Not found ticket";
            }

            existedTicket.Status = Core.Enum.TicketStatus.Invalid;
            _ticketRepository.Update(existedTicket);
            existedTicket.IsTicketCodeValid = invalidField.ToLower().Contains("ticket code") ? false : true;
            existedTicket.IsVehicleValid = invalidField.ToLower().Contains("vehicle") ? false : true;
            existedTicket.IsTransportationValid = invalidField.ToLower().Contains("transportation") ? false : true;
            existedTicket.IsTicketTypeValid = invalidField.ToLower().Contains("ticket type") ? false : true;
            existedTicket.IsDepartureValid = invalidField.ToLower().Contains("departure") ? false : true;
            existedTicket.IsArrivalValid = invalidField.ToLower().Contains("arrival") ? false : true;
            existedTicket.IsPassengerNameValid = invalidField.ToLower().Contains("passenger") ? false : true;
            existedTicket.IsEmailBookingValid = invalidField.ToLower().Contains("email") ? false : true;
            try
            {
                _unitOfWork.CommitChanges();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
            var message = "Ticket " + existedTicket.TicketCode + " is invalid. " + invalidField + " are incorrect.";
            List<string> sellerDeviceIds = GetCustomerDeviceIds(existedTicket, true);

            //Save notification into db
            _notificationService.SaveNotification(
                customerId: existedTicket.SellerId,
                type: NotificationType.TicketIsReject,
                message: $"Ticket {existedTicket.TicketCode} is invalid. {System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo.ToTitleCase(invalidField.ToLower())} is incorrect.",
                data: new { ticketId = existedTicket.Id }
            );

            _oneSignalService.PushNotificationCustomer(message, sellerDeviceIds);

            return string.Empty;
        }

        public string ConfirmRenameTicket(int id)
        {
            var existedTicket = _ticketRepository.Get(x => x.Deleted == false && x.Id == id);
            if (existedTicket == null)
            {
                return "Not found ticket";
            }

            existedTicket.Status = Core.Enum.TicketStatus.Renamed;
            _ticketRepository.Update(existedTicket);
            try
            {
                _unitOfWork.CommitChanges();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
            //noti to staff
            List<string> adminDeviceIds = GetAdminDeviceIds();
            var message = "A ticket is renamed";
            _oneSignalService.PushNotificationAdmin(message, adminDeviceIds);

            return string.Empty;
        }

        public string ValidateRenameTicket(int id, bool renameSuccess)
        {
            var existedTicket = _ticketRepository.Get(x => x.Deleted == false && x.Id == id);
            if (existedTicket == null)
            {
                return "Not found ticket";
            }
            if (renameSuccess == true)
            {
                //existedTicket.Status = Core.Enum.TicketStatus.Completed;
                existedTicket.Status = TicketStatus.RenamedSuccess;
                _ticketRepository.Update(existedTicket);


                try
                {
                    _unitOfWork.CommitChanges();
                }
                catch (Exception ex)
                {
                    return ex.Message;
                }

                //noti to seller
                #region Notify Seller
                List<string> sellerDeviceIds = GetCustomerDeviceIds(existedTicket, true);
                var message = "Ticket " + existedTicket.TicketCode + " renamed successfully. We are processing to transfer your money.";

                //Save notification into db
                _notificationService.SaveNotification(
                    customerId: existedTicket.SellerId,
                    type: NotificationType.TicketIsConfirmedRenamed,
                    message: $"Ticket {existedTicket.TicketCode} renamed successfully. We are processing to transfer your money.",
                    data: new { ticketId = existedTicket.Id }
                );

                _oneSignalService.PushNotificationCustomer(message, sellerDeviceIds);
                #endregion

                //noti to buyer
                #region Notify Buyer
                List<string> buyerDeviceIds = GetCustomerDeviceIds(existedTicket, false);

                var boughtRoute = existedTicket.RouteTickets.Where(x =>
                    x.Route.CustomerId == existedTicket.BuyerId &&
                    x.Route.Status == RouteStatus.Bought &&
                    x.Route.Deleted == false &&
                    x.Deleted == false
                ).FirstOrDefault()
                ?.Route;

                message = "Ticket " + existedTicket.TicketCode + " in Route " + (boughtRoute?.Code ?? string.Empty) + " renamed successfully.";

                //Save notification into db
                if (existedTicket.BuyerId != null)
                {
                    _notificationService.SaveNotification(
                        customerId: existedTicket.BuyerId.Value,
                        type: NotificationType.TicketIsRenamed,
                        message: $"Ticket {existedTicket.TicketCode} in Route {boughtRoute?.Code ?? string.Empty} renamed successfully",
                        data: new { routeId = boughtRoute?.Id }
                    );
                }

                _oneSignalService.PushNotificationCustomer(message, buyerDeviceIds);
                #endregion

            }
            else
            {
                //existedTicket.Status = Core.Enum.TicketStatus.Invalid;
                existedTicket.Status = TicketStatus.RenamedFail;
                _ticketRepository.Update(existedTicket);
                try
                {
                    _unitOfWork.CommitChanges();
                }
                catch (Exception ex)
                {
                    return ex.Message;
                }

                #region Notify Seller
                List<string> sellerDeviceIds = GetCustomerDeviceIds(existedTicket, true);
                var message = "Ticket " + existedTicket.TicketCode + " renamed fail.";

                //Save notification into db
                _notificationService.SaveNotification(
                    customerId: existedTicket.SellerId,
                    type: NotificationType.TicketIsConfirmedRenamedFailed,
                    message: $"Ticket {existedTicket.TicketCode} renamed fail.",
                    data: new { ticketId = existedTicket.Id }
                );

                _oneSignalService.PushNotificationCustomer(message, sellerDeviceIds);
                #endregion

                //noti to buyer
                #region Notify Buyer
                var boughtRoute = existedTicket.RouteTickets.Where(x =>
                    x.Route.CustomerId == existedTicket.BuyerId &&
                    x.Route.Status == RouteStatus.Bought &&
                    x.Route.Deleted == false &&
                    x.Deleted == false
                ).FirstOrDefault()
                ?.Route;

                List<string> buyerDeviceIds = GetCustomerDeviceIds(existedTicket, false);
                message = "Ticket " + existedTicket.TicketCode + " in Route " + (boughtRoute?.Code ?? string.Empty) + " renamed fail.";
                _oneSignalService.PushNotificationCustomer(message, buyerDeviceIds);

                //save noti
                if (existedTicket.BuyerId != null)
                {
                    _notificationService.SaveNotification(
                        customerId: existedTicket.BuyerId.Value,
                        type: NotificationType.RouteHasRenamedFailTicket,
                        message: $"Ticket {existedTicket.TicketCode} in Route {boughtRoute?.Code ?? string.Empty} renamed fail.",
                        data: new { ticketId = boughtRoute?.Id }
                    );
                }

                #endregion
            }

            return string.Empty;
        }

        public List<AvailableTicketViewModel> GetTicketAvailableForRouteTicket(int routeTicketId)
        {
            var routeTicket = _routeTicketRepository.Get(x =>
                x.Id == routeTicketId &&
                x.Deleted == false
            );

            if (routeTicket == null) throw new NotFoundException();

            DateTime? departureFromDateUTC = null;
            DateTime? arrivalToDateUTC = null;
            int departureCityId = routeTicket.DepartureStation.CityId;
            int arrivalCityId = routeTicket.ArrivalStation.CityId;

            var previousRouteTicket = _routeTicketRepository.Get(x =>
                x.RouteId == routeTicket.RouteId &&
                x.Deleted == false &&
                x.Order == routeTicket.Order - 1
            );

            var nextRouteTicket = _routeTicketRepository.Get(x =>
                x.RouteId == routeTicket.RouteId &&
                x.Deleted == false &&
                x.Order == routeTicket.Order + 1
            );

            if (previousRouteTicket != null)
                //TODO: Add waiting time amount
                departureFromDateUTC = previousRouteTicket.Ticket.ArrivalDateTimeUTC;

            if (nextRouteTicket != null)
                //TODO: Add waiting time amount
                arrivalToDateUTC = nextRouteTicket.Ticket.DepartureDateTimeUTC;

            //Get Tickets base on fromDate and toDate
            var tickets = _ticketRepository.GetAllQueryable()
                .Where(x => x.Deleted == false
                    && x.SellerId != routeTicket.Ticket.BuyerId &&
                    x.Status == Core.Enum.TicketStatus.Valid &&
                    ((departureFromDateUTC == null && x.DepartureDateTimeUTC > DateTime.UtcNow) || x.DepartureDateTimeUTC >= departureFromDateUTC) &&
                    (arrivalToDateUTC == null || x.ArrivalDateTimeUTC <= arrivalToDateUTC) &&
                    x.DepartureStation.CityId == departureCityId &&
                    x.ArrivalStation.CityId == arrivalCityId &&
                    x.Id != routeTicket.TicketId &&
                    x.ExpiredDateTimeUTC > DateTime.UtcNow
                );

            var result = _mapper.Map<List<Ticket>, List<AvailableTicketViewModel>>(tickets.ToList());

            return result;
        }

        public string RefuseTicket(int id)
        {
            var existedTicket = _ticketRepository.Get(x => x.Id == id && x.Deleted == false);
            if (existedTicket == null)
            {
                return "Not found ticket";
            }

            //existedTicket.Status = Core.Enum.TicketStatus.Invalid;
            existedTicket.Status = TicketStatus.RenamedFail;
            _ticketRepository.Update(existedTicket);
            _unitOfWork.CommitChanges();

            #region Notify Buyer
            var boughtRoute = existedTicket.RouteTickets
                .Where(x =>
                    x.Deleted == false &&
                    x.Route.Deleted == false &&
                    x.Route.Status == RouteStatus.Bought &&
                    x.Route.CustomerId == existedTicket.BuyerId
                ).FirstOrDefault()
                ?.Route;

            var message = "Ticket " + existedTicket.TicketCode + " in Route " + (boughtRoute?.Code ?? string.Empty) + " has been refused.";
            //if(_routeTicketRepository.Get(x => x.Deleted == false && x.TicketId == existedTicket.Id).Route.CustomerId == existedTicket.BuyerId)
            //{
            //    message += "Our staff will contact you in a few minutes.";
            //}
            List<string> buyerDeviceIds = GetCustomerDeviceIds(existedTicket, false);

            //save notification into db
            if (existedTicket.BuyerId != null)
            {
                _notificationService.SaveNotification(
                    customerId: existedTicket.BuyerId.Value,
                    type: NotificationType.TicketIsRefuse,
                    message: $"Ticket {existedTicket.TicketCode} in Route {boughtRoute?.Code ?? string.Empty} has been refused.",
                    data: new { routeId = boughtRoute?.Id }
                );
            }

            _oneSignalService.PushNotificationCustomer(message, buyerDeviceIds);
            #endregion


            return string.Empty;
        }

        public List<string> GetCustomerDeviceIds(Ticket ticket, bool isSeller)
        {
            var customerDevices = isSeller
                ? ticket.Seller.CustomerDevices.Where(x => x.Deleted == false && x.IsLogout == false).ToList()
                : ticket.Buyer.CustomerDevices.Where(x => x.Deleted == false && x.IsLogout == false).ToList();
            List<string> deviceIds = new List<string>();

            foreach (var sellerDevice in customerDevices)
            {
                if (sellerDevice.DeviceId != "" && sellerDevice.DeviceId != null)
                {
                    deviceIds.Add(sellerDevice.DeviceId);
                }
            }
            return deviceIds;
        }

        public List<string> GetAdminDeviceIds()
        {
            var staffs = _userManager.GetUsersInRoleAsync("STAFF").Result;
            List<string> adminDeviceIds = new List<string>();
            List<AdminDevice> adminDevices = new List<AdminDevice>();
            foreach (var staff in staffs)
            {
                adminDevices.AddRange(_adminDeviceRepository.GetAllQueryable()
                    .Where(x => x.Deleted == false && x.UserId == staff.Id).ToList());
            }
            foreach (var device in adminDevices)
            {
                if (device.DeviceId != "" && device.DeviceId != null)
                {
                    adminDeviceIds.Add(device.DeviceId);
                }
            }
            return adminDeviceIds;
        }

        public void EditInfoTicket(Ticket existedTicket, TicketEditViewModel model)
        {
            existedTicket.TransportationId = model.TransportationId;
            existedTicket.TicketTypeId = model.TicketTypeId;
            existedTicket.DepartureStationId = model.DepartureStationId;
            existedTicket.DepartureDateTime = model.DepartureDateTime;
            existedTicket.ArrivalStationId = model.ArrivalStationId;
            existedTicket.ArrivalDateTime = model.ArrivalDateTime;
            existedTicket.TicketCode = model.TicketCode;
            existedTicket.PassengerName = model.PassengerName;
            existedTicket.EmailBooking = model.EmailBooking;
            existedTicket.SellingPrice = model.SellingPrice;
            existedTicket.ExpiredDateTime = model.DepartureDateTime;

            //convert time into UTC time
            var departureStation = existedTicket.DepartureStation;
            if (departureStation.City.TimeZoneId != null)
            {
                existedTicket.DepartureDateTimeUTC = model.DepartureDateTime.ToSpecifiedTimeZone(departureStation.City.TimeZoneId);
                existedTicket.ExpiredDateTimeUTC = model.DepartureDateTime.ToSpecifiedTimeZone(departureStation.City.TimeZoneId);
            }
            else
            {
                existedTicket.DepartureDateTimeUTC = model.DepartureDateTime;
                existedTicket.ExpiredDateTimeUTC = model.DepartureDateTime;
            }

            var arrivalStation = existedTicket.ArrivalStation;
            if (arrivalStation.City.TimeZoneId != null)
            {
                existedTicket.ArrivalDateTimeUTC = model.ArrivalDateTime.ToSpecifiedTimeZone(arrivalStation.City.TimeZoneId);
            }
            else
            {
                existedTicket.ArrivalDateTimeUTC = model.ArrivalDateTime;
            }
        }

        public bool CheckInvalidFieldRemain(Ticket existedTicket)
        {
            if (existedTicket.IsTicketCodeValid == false) return false;
            if (existedTicket.IsVehicleValid == false) return false;
            if (existedTicket.IsTransportationValid == false) return false;
            if (existedTicket.IsTicketTypeValid == false) return false;
            if (existedTicket.IsDepartureValid == false) return false;
            if (existedTicket.IsArrivalValid == false) return false;
            if (existedTicket.IsPassengerNameValid == false) return false;
            if (existedTicket.IsEmailBookingValid == false) return false;
            return true;
        }

        public TicketDataTable GetReplaceTickets(int routeTicketId)
        {
            var routeTickets = _routeTicketRepository.Get(
                                x => x.Deleted == false && x.Id == routeTicketId
                                && x.Route.Status == RouteStatus.Bought)
                                .Route.RouteTickets.OrderBy(x => x.Order);

            var ticketDataTable = new TicketDataTable();
            if (routeTickets.Count() == 2)
            {
                var firstTicket = routeTickets.FirstOrDefault().Ticket;
                var lastTicket = routeTickets.LastOrDefault().Ticket;
                var replaceTickets = new List<Ticket>();
                if (firstTicket.Status == TicketStatus.RenamedFail)
                {
                    var lastTicketDepartureDatetime = lastTicket.DepartureDateTimeUTC;
                    replaceTickets = _ticketRepository.GetAllQueryable()
                        .Where(x => x.Deleted == false && x.ExpiredDateTimeUTC > DateTime.UtcNow && x.Status == TicketStatus.Valid)
                        .Where(x => x.ArrivalDateTimeUTC <= lastTicketDepartureDatetime && x.SellingPrice <= firstTicket.SellingPrice).ToList();

                }
                else
                {
                    var firstArrivalDateTime = firstTicket.ArrivalDateTimeUTC;
                    replaceTickets = _ticketRepository.GetAllQueryable()
                        .Where(x => x.Deleted == false && x.ExpiredDateTimeUTC > DateTime.UtcNow && x.Status == TicketStatus.Valid)
                        .Where(x => x.DepartureDateTimeUTC >= firstArrivalDateTime && x.SellingPrice <= lastTicket.SellingPrice).ToList();
                }

                var replaceTicketVms = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(replaceTickets);
                ticketDataTable.Data = replaceTicketVms;
                ticketDataTable.Total = replaceTickets.Count();
            }
            else if (routeTickets.Count() == 3)
            {

            }

            return ticketDataTable;
        }

        public AvailableTicketDataTable GetReplaceTicketForOneFailTicket(int failRouteTicketId, int page, int pageSize)
        {
            List<AvailableTicketViewModel> replaceTickets = GetTicketAvailableForRouteTicket(failRouteTicketId);
            var routeTicket = _routeTicketRepository.Get(x =>
                x.Id == failRouteTicketId &&
                x.Deleted == false
            );
            replaceTickets = replaceTickets.Where(x => x.SellingPrice <= routeTicket.Ticket.SellingPrice).ToList();
            var replaceTicketsTotal = replaceTickets.Count();
            var replacePagedTickets = replaceTickets.Skip((page - 1) * pageSize).Take(pageSize);
            AvailableTicketDataTable resultDataTable = new AvailableTicketDataTable()
            {
                Data = replacePagedTickets.ToList(),
                Total = replaceTicketsTotal
            };
            return resultDataTable;
        }

        public void setRenamedFailBoughtTicket(int id)
        {
            var existedTicket = _ticketRepository.Get(x => x.Id == id);
            if(existedTicket == null)
            {
                throw new Exception();
            }
            existedTicket.Status = TicketStatus.RenamedFail;
            _ticketRepository.Update(existedTicket);
            _unitOfWork.CommitChanges();
        }
    }
}
