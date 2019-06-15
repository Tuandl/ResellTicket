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

        string ApproveTicket(int id);
        void PostTicket(TicketPostViewModel model);
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

        public void PostTicket(TicketPostViewModel model)
        {
            var ticket = _mapper.Map<TicketPostViewModel, Ticket>(model);
            ticket.CommissionPercent = 10;
            ticket.Status = Core.Enum.TicketStatus.Pending;
            ticket.CustomerId = 1;
            _ticketRepository.Add(ticket);
            _unitOfWork.CommitChanges();
        }
    }
}
