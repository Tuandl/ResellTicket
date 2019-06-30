using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using AutoMapper;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using Microsoft.AspNetCore.Identity;
using ViewModel.ErrorViewModel;
using ViewModel.ViewModel.Ticket;
using System.IO;
using System.Net;
using Newtonsoft.Json;
using Microsoft.Extensions.Options;
using ViewModel.AppSetting;
using Service.NotificationService;

namespace Service.Services
{
    public interface ITicketService
    {
        List<TicketRowViewModel> GetTickets();

        //getTicketsPendingStatus
        List<TicketRowViewModel> GetPendingTickets();

        //getTicketsValidStatus
        List<TicketRowViewModel> GetValidTickets();
        //getTicketsInValidStatus
        List<TicketRowViewModel> GetInValidTickets();

        List<TicketRowViewModel> GetTickets(string param);
        //getTicketsRenameddStatus
        List<TicketRowViewModel> GetRenamedTickets();
        //getTicketsBoughtStatus
        List<TicketRowViewModel> GetBoughtTickets();
        //getTicketsCompletedStatus
        List<TicketRowViewModel> GetCompletedTickets();
        string ApproveTicket(int id, decimal commissionFee, DateTime expiredDatetime);
        string RejectTicket(int id, string invalidField);
        int PostTicket(string username, TicketPostViewModel model);
        void EditTicket(TicketEditViewModel model);
        void DeleteTicket(int ticketId);
        List<CustomerTicketViewModel> GetCustomerTickets(string username, int page);
        TicketDetailViewModel GetTicketDetail(int ticketId);
        string ConfirmRenameTicket(int id);
        string ValidateRenameTicket(int id, bool renameSuccess);
        string RefuseTicket(int id);

        /// <summary>
        /// Get Tickets available for editing a route ticket
        /// </summary>
        /// <param name="routeId"></param>
        /// <returns></returns>
        List<CustomerTicketViewModel> GetTicketAvailableForRouteTicket(int routeTicketId);
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

        public TicketService(IMapper mapper,
                             IUnitOfWork unitOfWork,
                             ITicketRepository ticketRepository,
                             ICustomerRepository customerRepository,
                             IStationRepository stationRepository,
                             IRouteTicketRepository routeTicketRepository,
                             ICustomerDeviceRepository customerDeviceRepository,
                             IOneSignalService oneSignalService,
                             UserManager<User> userManager,
                             IAdminDeviceRepository adminDeviceRepository
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

        public List<TicketRowViewModel> GetPendingTickets()
        {
            var pendingTickets = _ticketRepository.GetAllQueryable().Where(t => t.Status == Core.Enum.TicketStatus.Pending).ToList();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(pendingTickets);
            //foreach (var ticketRow in ticketRowViewModels)
            //{
            //    //var customer = _customerRepository.Get(x => x.Id == ticketRow.CustomerId);
            //    //ticketRow.SellerPhone = customer.PhoneNumber;
            //    var departureCity = _stationRepository.Get(s => s.Id == ticketRow.DepartureStationId).City.Name;
            //    var arrivalCity = _stationRepository.Get(s => s.Id == ticketRow.ArrivalStationId).City.Name;
            //    ticketRow.DepartureCity = departureCity;
            //    ticketRow.ArrivalCity = arrivalCity;
            //}

            return ticketRowViewModels;
        }

        public List<TicketRowViewModel> GetValidTickets()
        {
            var validTickets = _ticketRepository.GetAllQueryable().Where(t => t.Status == Core.Enum.TicketStatus.Valid).ToList();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(validTickets);


            return ticketRowViewModels;
        }

        public List<TicketRowViewModel> GetRenamedTickets()
        {
            var renamedTickets = _ticketRepository.GetAllQueryable().Where(t => t.Status == Core.Enum.TicketStatus.Renamed).ToList();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(renamedTickets);

            return ticketRowViewModels;
        }

        public List<TicketRowViewModel> GetBoughtTickets()
        {
            var boughtTickets = _ticketRepository.GetAllQueryable().Where(t => t.Status == Core.Enum.TicketStatus.Bought).ToList();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(boughtTickets);

            return ticketRowViewModels;
        }

        public List<TicketRowViewModel> GetCompletedTickets()
        {
            var completedTickets = _ticketRepository.GetAllQueryable().Where(t => t.Status == Core.Enum.TicketStatus.Completed).ToList();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(completedTickets);

            return ticketRowViewModels;
        }

        public List<CustomerTicketViewModel> GetCustomerTickets(string username, int page)
        {
            var existedCustomer = _customerRepository.Get(x => x.Username == username);
            var customerTickets = _ticketRepository.GetAllQueryable()
                .Where(x => x.SellerId == existedCustomer.Id)
                .Where(x => x.Deleted == false)
                .OrderByDescending(x => x.UpdatedAt ?? x.CreatedAt)
                .Skip((page - 1) * 5).Take(5)
                .ToList();
            var customerTicketVMs = _mapper.Map<List<Ticket>, List<CustomerTicketViewModel>>(customerTickets);
            return customerTicketVMs;
        }

        public List<TicketRowViewModel> GetTickets(string param)
        {
            param = param ?? "";
            var tickets = _ticketRepository.GetAllQueryable()
                         .Where(x => x.TicketCode.ToLower().Contains(param.ToLower())).ToList();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(tickets);
            return ticketRowViewModels;
        }

        public List<TicketRowViewModel> GetInValidTickets()
        {
            var invalidTickets = _ticketRepository.GetAllQueryable().Where(t => t.Status == Core.Enum.TicketStatus.Invalid).ToList();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(invalidTickets);

            return ticketRowViewModels;
        }

        public List<CustomerTicketViewModel> GetTicketAvailableForRouteTicket(int routeTicketId)
        {
            var routeTicket = _routeTicketRepository.Get(x =>
                x.Id == routeTicketId &&
                x.Deleted == false
            );

            if (routeTicket == null) throw new NotFoundException();

            DateTime? departureFromDate = null;
            DateTime? arrivalToDate = null;
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
                departureFromDate = previousRouteTicket.Ticket.ArrivalDateTime;

            if (nextRouteTicket != null)
                //TODO: Add waiting time amount
                arrivalToDate = nextRouteTicket.Ticket.DepartureDateTime;

            //Get Tickets base on fromDate and toDate
            var tickets = _ticketRepository.GetAllQueryable()
                .Where(x => x.Deleted == false &&
                    x.Status == Core.Enum.TicketStatus.Valid &&
                    (departureFromDate == null || x.DepartureDateTime >= departureFromDate) &&
                    (arrivalToDate == null || x.ArrivalDateTime <= arrivalToDate) &&
                    x.DepartureStation.CityId == departureCityId &&
                    x.ArrivalStation.CityId == arrivalCityId &&
                    x.Id != routeTicket.TicketId
                );

            var result = _mapper.Map<List<Ticket>, List<CustomerTicketViewModel>>(tickets.ToList());

            return result;
        }
        //Get

        public int PostTicket(string username, TicketPostViewModel model)
        {
            var customerId = _customerRepository.Get(x => x.Username == username).Id;
            var ticket = _mapper.Map<TicketPostViewModel, Ticket>(model);
            ticket.CommissionPercent = 10;
            ticket.Status = Core.Enum.TicketStatus.Pending;
            ticket.SellerId = customerId;
            ticket.ExpiredDateTime = model.DepartureDateTime;
            _ticketRepository.Add(ticket);
            _unitOfWork.CommitChanges();

            // noti to staff
            List<string> adminDeviceIds = GetAdminDeviceIds();
            var message = "A new ticket is posted";
            _oneSignalService.PushNotificationAdmin(message, adminDeviceIds);
            return ticket.Id;
        }

        public void EditTicket(TicketEditViewModel model)
        {
            var existedTicket = _ticketRepository.Get(x => x.Id == model.Id);
            if (model.TransportationId != -1 && model.TransportationId != existedTicket.TransportationId)
            {
                existedTicket.TransportationId = model.TransportationId;
            }
            if (model.ArrivalStationId != -1 && model.ArrivalStationId != existedTicket.ArrivalStationId)
            {
                existedTicket.ArrivalStationId = model.ArrivalStationId;
            }
            if (model.DepartureStationId != -1 && model.DepartureStationId != existedTicket.DepartureStationId)
            {
                existedTicket.DepartureStationId = model.DepartureStationId;
            }
            if (model.TicketTypeId != -1 && model.TicketTypeId != existedTicket.TicketTypeId)
            {
                existedTicket.TicketTypeId = model.TicketTypeId;
            }
            if (model.DepartureDateTime != existedTicket.DepartureDateTime)
            {
                existedTicket.DepartureDateTime = model.DepartureDateTime;
            }
            if (model.ArrivalDateTime != existedTicket.ArrivalDateTime)
            {
                existedTicket.ArrivalDateTime = model.ArrivalDateTime;
            }
            existedTicket.TicketCode = model.TicketCode;
            existedTicket.SellingPrice = model.SellingPrice;
            _ticketRepository.Update(existedTicket);
            _unitOfWork.CommitChanges();
        }

        public void DeleteTicket(int ticketId)
        {
            var existedTicket = _ticketRepository.Get(x => x.Id == ticketId);
            existedTicket.Deleted = true;
            _ticketRepository.Update(existedTicket);
            _unitOfWork.CommitChanges();
        }

        public string ApproveTicket(int id, decimal commissionFee, DateTime expiredDateTime)
        {
            var existedTicket = _ticketRepository.Get(x => x.Id == id);
            if (existedTicket == null)
            {
                return "Not found ticket";
            }

            existedTicket.Status = Core.Enum.TicketStatus.Valid;
            existedTicket.CommissionPercent = commissionFee;
            existedTicket.ExpiredDateTime = expiredDateTime;
            _ticketRepository.Update(existedTicket);
            try
            {
                _unitOfWork.CommitChanges();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
            var message = "Ticket " + existedTicket.TicketCode + " is valid";
            List<string> sellerDeviceIds = GetCustomerDeviceIds(existedTicket, true);
            _oneSignalService.PushNotificationCustomer(message, sellerDeviceIds);

            return string.Empty;
        }

        public string RejectTicket(int id, string invalidField)
        {
            var existedTicket = _ticketRepository.Get(x => x.Id == id);
            if (existedTicket == null)
            {
                return "Not found ticket";
            }

            existedTicket.Status = Core.Enum.TicketStatus.Invalid;
            _ticketRepository.Update(existedTicket);
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
            _oneSignalService.PushNotificationCustomer(message, sellerDeviceIds);

            return string.Empty;
        }

        public string ConfirmRenameTicket(int id)
        {
            var existedTicket = _ticketRepository.Get(x => x.Id == id);
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
            var existedTicket = _ticketRepository.Get(x => x.Id == id);
            if (existedTicket == null)
            {
                return "Not found ticket";
            }
            if (renameSuccess == true)
            {
                existedTicket.Status = Core.Enum.TicketStatus.Completed;
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
                List<string> sellerDeviceIds = GetCustomerDeviceIds(existedTicket, true);
                var message = "Ticket " + existedTicket.TicketCode + " renamed successfully. Money will be tranfered in a few minutes";
                _oneSignalService.PushNotificationCustomer(message, sellerDeviceIds);

                //noti to buyer
                List<string> buỷerDeviceIds = GetCustomerDeviceIds(existedTicket, false);
                message = "Ticket " + existedTicket.TicketCode + " renamed successfully. Please check your email.";
                _oneSignalService.PushNotificationCustomer(message, buỷerDeviceIds);
            }
            else
            {
                existedTicket.Status = Core.Enum.TicketStatus.Bought;
                _ticketRepository.Update(existedTicket);
                try
                {
                    _unitOfWork.CommitChanges();
                }
                catch (Exception ex)
                {
                    return ex.Message;
                }
                List<string> sellerDeviceIds = GetCustomerDeviceIds(existedTicket, true);
                var message = "Ticket " + existedTicket.TicketCode + " renamed fail. Please check and rename again.";
                _oneSignalService.PushNotificationCustomer(message, sellerDeviceIds);
            }

            return string.Empty;
        }

        
        public string RefuseTicket(int id)
        {
            var existedTicket = _ticketRepository.Get(x => x.Id == id);
            if (existedTicket == null)
            {
                return "Not found ticket";
            }

            existedTicket.Status = Core.Enum.TicketStatus.Invalid;
            _ticketRepository.Update(existedTicket);
            _unitOfWork.CommitChanges();
            var message = "Ticket " + existedTicket.TicketCode + " has been refused";
            List<string> buyerDeviceIds = GetCustomerDeviceIds(existedTicket, false);
            _oneSignalService.PushNotificationCustomer(message, buyerDeviceIds);
            return string.Empty;
        }

        public List<string> GetCustomerDeviceIds(Ticket ticket, bool isSeller)
        {
            var customerDevices = isSeller
                ? ticket.Seller.CustomerDevices.Where(x => x.IsLogout == false).ToList()
                : ticket.Buyer.CustomerDevices.Where(x => x.IsLogout == false).ToList();
            List<string> deviceIds = new List<string>();

            foreach (var sellerDevice in customerDevices)
            {
                deviceIds.Add(sellerDevice.DeviceId);
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
                adminDevices.AddRange(_adminDeviceRepository.GetAllQueryable().Where(x => x.UserId == staff.Id).ToList());  
            }
            foreach(var device in adminDevices)
            {
                adminDeviceIds.Add(device.DeviceId);
            }
            return adminDeviceIds;
        }
    }
}
