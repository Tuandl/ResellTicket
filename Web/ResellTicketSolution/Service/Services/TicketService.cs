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
        void PostTicket(TicketPostViewModel model);
        List<CustomerTicketViewModel> GetCustomerTickets(int customerId);
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

        public List<CustomerTicketViewModel> GetCustomerTickets(int customerId)
        {
            var customerTickets = _ticketRepository.GetAllQueryable().Where(x => x.CustomerId == customerId).ToList();
            var customerTicketVMs = _mapper.Map<List<Ticket>, List<CustomerTicketViewModel>>(customerTickets);
            return customerTicketVMs;
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
