﻿using Microsoft.Extensions.Options;
using ViewModel.AppSetting;
using SendGrid;
using SendGrid.Helpers.Mail;
using Core.Repository;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System;
using ViewModel.ViewModel.Route;
using System.Linq;
using System.Collections.Generic;
using ViewModel.ViewModel.Ticket;
using AutoMapper;
using Core.Models;

namespace Service.EmailService
{
    public interface ISendGridService
    {
        void SendEmailReceiptForBuyer(int routeId);
    }
    public class SendGridService : ISendGridService
    {
        private readonly IOptions<SendGridSetting> SETTING;
        private readonly ICustomerRepository _customerRepository;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IRouteRepository _routeRepository;
        private readonly IRouteTicketRepository _routeTicketRepository;
        private readonly ITicketRepository _ticketRepository;
        private readonly IMapper _mapper;
        private readonly IStationRepository _stationRepository;
        public SendGridService(IOptions<SendGridSetting> options, ICustomerRepository customerRepository, IHostingEnvironment hostingEnvironment, IRouteRepository routeRepository, IRouteTicketRepository routeTicketRepository, ITicketRepository ticketRepository, IMapper mapper, IStationRepository stationRepository)
        {
            SETTING = options;
            _customerRepository = customerRepository;
            _hostingEnvironment = hostingEnvironment;
            _routeRepository = routeRepository;
            _routeTicketRepository = routeTicketRepository;
            _ticketRepository = ticketRepository;
            _mapper = mapper;
            _stationRepository = stationRepository;
        }

        public void SendEmailReceiptForBuyer(int routeId)
        {
            var apiKey = SETTING.Value.SendGridKey;
            var client = new SendGridClient(apiKey);
            string emailTemplateHtml = _hostingEnvironment.ContentRootPath + "\\EmailTemplate\\EmailTemplate.html";
            string ticketTemplatehtml = _hostingEnvironment.ContentRootPath + "\\EmailTemplate\\TicketsTemplate.html";
            string body = string.Empty;
            string ticketList = string.Empty;
            var route = _routeRepository.Get(r => r.Id == routeId);
            var customer = _customerRepository.Get(c => c.Id == route.CustomerId);
            //using streamreader for reading my htmltemplate   
            using (StreamReader reader = new StreamReader(emailTemplateHtml))
            {
                body = reader.ReadToEnd();
            }
            var customerEmail = _customerRepository.Get(c => c.Id == route.CustomerId).Email;
            var customerName = customer.FullName;
            var customerPhone = customer.PhoneNumber;
            var routeCode = route.Code;
            var totalAmount = route.TotalAmount;
            var date = DateTime.UtcNow;
            var routeTickets = _routeTicketRepository.GetAllQueryable().Where(r => r.RouteId == routeId);
            List<TicketRowViewModel> tickets = new List<TicketRowViewModel>();
            foreach (var routeTicket in routeTickets)
            {
                var ticket = _ticketRepository.Get(t => t.Id == routeTicket.TicketId);
                var ticketRowViewModel = _mapper.Map<Ticket, TicketRowViewModel>(ticket);
                tickets.Add(ticketRowViewModel);
            }
            //replacing the required things  
            body = body.Replace("{routeCode}", routeCode);
            body = body.Replace("{customerName}", customerName);
            body = body.Replace("{customerEmail}", customerEmail);
            body = body.Replace("{customerPhone}", customerPhone);
            body = body.Replace("{Date}", date.ToString());
            body = body.Replace("{subTotal}", totalAmount.ToString());
            body = body.Replace("{Total}", totalAmount.ToString());

            body = body.Replace("{Term}", SETTING.Value.Term);
            body = body.Replace("{Title}", SETTING.Value.Title);
            body = body.Replace("{fromName}", SETTING.Value.FromName);
            body = body.Replace("{fromEmail}", SETTING.Value.FromEmail);
            body = body.Replace("{Street}", SETTING.Value.Street);
            body = body.Replace("{City}", SETTING.Value.City);
            body = body.Replace("{addressNumber}", SETTING.Value.AddressNumber);
            body = body.Replace("{phoneNumber}", SETTING.Value.PhoneNumber);
            body = body.Replace("{bussinessNumber}", SETTING.Value.BussinessNumber);
            foreach (var ticket in tickets)
            {
                using (StreamReader reader = new StreamReader(ticketTemplatehtml))
                {
                    var ticketRow = reader.ReadToEnd();
                    var departureStation = _stationRepository.Get(s => s.Id == ticket.DepartureStationId).Name;
                    var arrivalStation = _stationRepository.Get(s => s.Id == ticket.ArrivalStationId).Name;
                    ticketRow = ticketRow.Replace("{ticketCode}", ticket.TicketCode);
                    ticketRow = ticketRow.Replace("{Description}", ticket.Description);
                    ticketRow = ticketRow.Replace("{departureCity}", ticket.DepartureCity);
                    ticketRow = ticketRow.Replace("{departureStation}", departureStation);
                    ticketRow = ticketRow.Replace("{departureTime}", ticket.DepartureDateTime.ToString());
                    ticketRow = ticketRow.Replace("{arrivalCity}", ticket.ArrivalCity);
                    ticketRow = ticketRow.Replace("{arrivalStation}", arrivalStation);
                    ticketRow = ticketRow.Replace("{arrivalTime}", ticket.ArrivalDateTime.ToString());
                    ticketRow = ticketRow.Replace("{Amount}", ticket.SellingPrice.ToString());

                    ticketList += ticketRow;
                }
            }
            body = body.Replace("{ticketList}", ticketList);
            
            var from = new EmailAddress(SETTING.Value.FromEmail, SETTING.Value.FromName);
            var subject = routeCode + " - Receipt";
            var to = new EmailAddress(customerEmail, customerName);
            var plainTextContent = "";
            var htmlContent = body;
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            client.SendEmailAsync(msg);
        }
    }
}
