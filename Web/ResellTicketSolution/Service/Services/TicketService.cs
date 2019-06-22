using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using AutoMapper;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using Microsoft.AspNetCore.Identity;
using ViewModel.ViewModel.Ticket;

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
        string ApproveTicket(int id);

        string RejectTicket(int id);

        void PostTicket(string username, TicketPostViewModel model);
        void EditTicket(TicketEditViewModel model);
        void DeleteTicket(int ticketId);
        List<CustomerTicketViewModel> GetCustomerTickets(string username, int page);
        TicketDetailViewModel GetTicketDetail(int ticketId);
        string ConfirmRenameTicket(int id);
        string ValidateRenameTicket(int id, bool renameSuccess);
    }
    public class TicketService : ITicketService
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ITicketRepository _ticketRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly IStationRepository _stationRepository;
        public TicketService(IMapper mapper,
                             IUnitOfWork unitOfWork,
                             ITicketRepository ticketRepository,
                             ICustomerRepository customerRepository,
                             IStationRepository stationRepository
        )
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _ticketRepository = ticketRepository;
            _customerRepository = customerRepository;
            _stationRepository = stationRepository;
        }

        public List<TicketRowViewModel> GetTickets()
        {
            var tickets = _ticketRepository.GetAll().ToList();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(tickets);
            foreach (var ticketRow in ticketRowViewModels)
            {
                //var customer = _customerRepository.Get(x => x.Id == ticketRow.CustomerId);
                //ticketRow.SellerPhone = customer.PhoneNumber;
                var departureCity = _stationRepository.Get(s => s.Id == ticketRow.DepartureStationId).City.Name;
                var arrivalCity = _stationRepository.Get(s => s.Id == ticketRow.ArrivalStationId).City.Name;
                ticketRow.DepartureCity = departureCity;
                ticketRow.ArrivalCity = arrivalCity;
            }

            return ticketRowViewModels;
        }

        public List<TicketRowViewModel> GetPendingTickets()
        {
            var pendingTickets = _ticketRepository.GetAllQueryable().Where(t => t.Status == Core.Enum.TicketStatus.Pending).ToList();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(pendingTickets);
            foreach (var ticketRow in ticketRowViewModels)
            {
                //var customer = _customerRepository.Get(x => x.Id == ticketRow.CustomerId);
                //ticketRow.SellerPhone = customer.PhoneNumber;
                var departureCity = _stationRepository.Get(s => s.Id == ticketRow.DepartureStationId).City.Name;
                var arrivalCity = _stationRepository.Get(s => s.Id == ticketRow.ArrivalStationId).City.Name;
                ticketRow.DepartureCity = departureCity;
                ticketRow.ArrivalCity = arrivalCity;
            }

            return ticketRowViewModels;
        }

        public List<TicketRowViewModel> GetValidTickets()
        {
            var validTickets = _ticketRepository.GetAllQueryable().Where(t => t.Status == Core.Enum.TicketStatus.Valid).ToList();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(validTickets);
            foreach (var ticketRow in ticketRowViewModels)
            {
                //var customer = _customerRepository.Get(x => x.Id == ticketRow.CustomerId);
                //ticketRow.SellerPhone = customer.PhoneNumber;
                var departureCity = _stationRepository.Get(s => s.Id == ticketRow.DepartureStationId).City.Name;
                var arrivalCity = _stationRepository.Get(s => s.Id == ticketRow.ArrivalStationId).City.Name;
                ticketRow.DepartureCity = departureCity;
                ticketRow.ArrivalCity = arrivalCity;
            }

            return ticketRowViewModels;
        }

        public List<TicketRowViewModel> GetRenamedTickets()
        {
            var renamedTickets = _ticketRepository.GetAllQueryable().Where(t => t.Status == Core.Enum.TicketStatus.Renamed).ToList();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(renamedTickets);
            foreach (var ticketRow in ticketRowViewModels)
            {
                //var customer = _customerRepository.Get(x => x.Id == ticketRow.CustomerId);
                //ticketRow.SellerPhone = customer.PhoneNumber;
                var departureCity = _stationRepository.Get(s => s.Id == ticketRow.DepartureStationId).City.Name;
                var arrivalCity = _stationRepository.Get(s => s.Id == ticketRow.ArrivalStationId).City.Name;
                ticketRow.DepartureCity = departureCity;
                ticketRow.ArrivalCity = arrivalCity;
            }

            return ticketRowViewModels;
        }

        public List<TicketRowViewModel> GetBoughtTickets()
        {
            var boughtTickets = _ticketRepository.GetAllQueryable().Where(t => t.Status == Core.Enum.TicketStatus.Bought).ToList();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(boughtTickets);
            foreach (var ticketRow in ticketRowViewModels)
            {
                //var customer = _customerRepository.Get(x => x.Id == ticketRow.CustomerId);
                //ticketRow.SellerPhone = customer.PhoneNumber;
                var departureCity = _stationRepository.Get(s => s.Id == ticketRow.DepartureStationId).City.Name;
                var arrivalCity = _stationRepository.Get(s => s.Id == ticketRow.ArrivalStationId).City.Name;
                ticketRow.DepartureCity = departureCity;
                ticketRow.ArrivalCity = arrivalCity;
            }

            return ticketRowViewModels;
        }

        public List<TicketRowViewModel> GetCompletedTickets()
        {
            var completedTickets = _ticketRepository.GetAllQueryable().Where(t => t.Status == Core.Enum.TicketStatus.Completed).ToList();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(completedTickets);
            foreach (var ticketRow in ticketRowViewModels)
            {
                //var customer = _customerRepository.Get(x => x.Id == ticketRow.CustomerId);
                //ticketRow.SellerPhone = customer.PhoneNumber;
                var departureCity = _stationRepository.Get(s => s.Id == ticketRow.DepartureStationId).City.Name;
                var arrivalCity = _stationRepository.Get(s => s.Id == ticketRow.ArrivalStationId).City.Name;
                ticketRow.DepartureCity = departureCity;
                ticketRow.ArrivalCity = arrivalCity;
            }

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
            foreach (var ticketRow in ticketRowViewModels)
            {
                //var customer = _customerRepository.Get(x => x.Id == ticketRow.CustomerId);
                //ticketRow.SellerPhone = customer.PhoneNumber;
                var departureCity = _stationRepository.Get(s => s.Id == ticketRow.DepartureStationId).City.Name;
                var arrivalCity = _stationRepository.Get(s => s.Id == ticketRow.ArrivalStationId).City.Name;
                ticketRow.DepartureCity = departureCity;
                ticketRow.ArrivalCity = arrivalCity;
            }

            return ticketRowViewModels;
        }

        public string ApproveTicket(int id)
        {
            var existedTicket = _ticketRepository.Get(x => x.Id == id);
            if (existedTicket == null)
            {
                return "Not found ticket";
            }

            existedTicket.Status = Core.Enum.TicketStatus.Valid;
            _ticketRepository.Update(existedTicket);
            try
            {
                _unitOfWork.CommitChanges();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

            return string.Empty;
        }
        public string RejectTicket(int id)
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

            return string.Empty;
        }
        public TicketDetailViewModel GetTicketDetail(int ticketId)
        {
            var ticketDetail = _ticketRepository.Get(x => x.Id == ticketId);
            var ticketDetailVM = _mapper.Map<Ticket, TicketDetailViewModel>(ticketDetail);
            return ticketDetailVM;
        }

        public void PostTicket(string username, TicketPostViewModel model)
        {
            var customerId = _customerRepository.Get(x => x.Username == username).Id;
            var ticket = _mapper.Map<TicketPostViewModel, Ticket>(model);
            ticket.CommissionPercent = 10;
            ticket.Status = Core.Enum.TicketStatus.Pending;
            ticket.SellerId = customerId;
            _ticketRepository.Add(ticket);
            _unitOfWork.CommitChanges();
        }

        public void EditTicket(TicketEditViewModel model)
        {
            var existedTicket = _ticketRepository.Get(x => x.Id == model.Id);
            if(model.TransportationId != -1 && model.TransportationId != existedTicket.TransportationId)
            {
                existedTicket.TransportationId = model.TransportationId;
            }
            if(model.ArrivalStationId != -1 && model.ArrivalStationId != existedTicket.ArrivalStationId)
            {
                existedTicket.ArrivalStationId = model.ArrivalStationId;
            }
            if(model.DepartureStationId != -1 && model.DepartureStationId != existedTicket.DepartureStationId)
            {
                existedTicket.DepartureStationId = model.DepartureStationId;
            }
            if(model.TicketTypeId != -1 && model.TicketTypeId != existedTicket.TicketTypeId)
            {
                existedTicket.TicketTypeId = model.TicketTypeId;
            }
            if(model.DepartureDateTime != existedTicket.DepartureDateTime)
            {
                existedTicket.DepartureDateTime = model.DepartureDateTime;
            }
            if(model.ArrivalDateTime != existedTicket.ArrivalDateTime)
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
            }
            
            return string.Empty;
        }

    }
}
