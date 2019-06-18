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

        List<TicketRowViewModel> GetInValidTickets();

        List<TicketRowViewModel> GetTickets(string param);

        string ApproveTicket(int id);

        string RejectTicket(int id);

        void PostTicket(TicketPostViewModel model);
        void EditTicket(TicketEditViewModel model);
        void DeleteTicket(int ticketId);
        List<CustomerTicketViewModel> GetCustomerTickets(int customerId, int page);
        TicketDetailViewModel GetTicketDetail(int ticketId);
    }
    public class TicketService : ITicketService
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ITicketRepository _ticketRepository;
        private readonly ICustomerRepository _customerRepository;
        public TicketService(IMapper mapper,
                             IUnitOfWork unitOfWork,
                             ITicketRepository ticketRepository,
                             ICustomerRepository customerRepository
        )
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _ticketRepository = ticketRepository;
            _customerRepository = customerRepository;
        }

        public List<TicketRowViewModel> GetTickets()
        {
            var tickets = _ticketRepository.GetAll().ToList();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(tickets);
            foreach (var ticketRow in ticketRowViewModels)
            {
                var customer = _customerRepository.Get(x => x.Id == ticketRow.CustomerId);
                ticketRow.SellerPhone = customer.PhoneNumber;
            }

            return ticketRowViewModels;
        }

        public List<TicketRowViewModel> GetPendingTickets()
        {
            var pendingTickets = _ticketRepository.GetAllQueryable().Where(t => t.Status == Core.Enum.TicketStatus.Pending).ToList();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(pendingTickets);
            foreach (var ticketRow in ticketRowViewModels)
            {
                var customer = _customerRepository.Get(x => x.Id == ticketRow.CustomerId);
                ticketRow.SellerPhone = customer.PhoneNumber;
            }

            return ticketRowViewModels;
        }

        public List<TicketRowViewModel> GetValidTickets()
        {
            var validTickets = _ticketRepository.GetAllQueryable().Where(t => t.Status == Core.Enum.TicketStatus.Valid).ToList();
            var ticketRowViewModels = _mapper.Map<List<Ticket>, List<TicketRowViewModel>>(validTickets);
            foreach (var ticketRow in ticketRowViewModels)
            {
                var customer = _customerRepository.Get(x => x.Id == ticketRow.CustomerId);
                ticketRow.SellerPhone = customer.PhoneNumber;
            }

            return ticketRowViewModels;
        }
        public List<CustomerTicketViewModel> GetCustomerTickets(int customerId, int page)
        {
            var customerTickets = _ticketRepository.GetAllQueryable()
                .Where(x => x.CustomerId == customerId)
                .Where(x => x.Deleted == false)
                .OrderByDescending(x => x.UpdatedAt)
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
                var customer = _customerRepository.Get(x => x.Id == ticketRow.CustomerId);
                ticketRow.SellerPhone = customer.PhoneNumber;
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

        public void PostTicket(TicketPostViewModel model)
        {
            var ticket = _mapper.Map<TicketPostViewModel, Ticket>(model);
            ticket.CommissionPercent = 10;
            ticket.Status = Core.Enum.TicketStatus.Pending;
            ticket.CustomerId = 1;
            _ticketRepository.Add(ticket);
            _unitOfWork.CommitChanges();
        }

        public void EditTicket(TicketEditViewModel model)
        {
            var existedTicket = _ticketRepository.Get(x => x.Id == model.Id);
            existedTicket.DepartureStationId = model.DepartureStationId;
            existedTicket.ArrivalStationId = model.ArrivalStationId;
            existedTicket.TransportationId = model.TransportationId;
            existedTicket.TicketTypeId = model.TicketTypeId;
            existedTicket.DepartureDateTime = model.DepartureDateTime;
            existedTicket.ArrivalDateTime = model.ArrivalDateTime;
            existedTicket.TicketCode = model.TicketCode;
            existedTicket.SellingPrice = model.SellingPrice;
            //var editTicket = _mapper.Map<TicketEditViewModel, Ticket>(model);
            //editTicket.CustomerId = existedTicket.CustomerId;
            //editTicket.Status = Core.Enum.TicketStatus.Pending;
            //editTicket.CommissionPercent = existedTicket.CommissionPercent;
            _ticketRepository.Update(existedTicket);
            _unitOfWork.CommitChanges();
        }

        public void DeleteTicket(int ticketId)
        {
            _ticketRepository.Delete(x => x.Id == ticketId);
            _unitOfWork.CommitChanges();
        }
    }
}
