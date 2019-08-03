using Microsoft.Extensions.Options;
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
        void SendEmailReceiptForSeller(int ticketId, decimal amount);
        void SendEmailRefundForBuyerAllTicket(int routeId, decimal remainRefund);
        void SendEmailRefundForBuyerOneTicket(int ticketId);
        void SendEmailReplacementForBuyer(int oldTicketId, int replacementTicketId);
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

        //Payment
        public void SendEmailReceiptForBuyer(int routeId)
        {
            try
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
                var subject = routeCode + " - Receipt - Payment";
                var to = new EmailAddress(customerEmail, customerName);
                var plainTextContent = "";
                var htmlContent = body;
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                client.SendEmailAsync(msg);
            }
            catch (Exception)
            {
            }
        }

        //Refund All Ticket
        public void SendEmailRefundForBuyerAllTicket(int routeId, decimal remainRefund)
        {
            try
            {
                var apiKey = SETTING.Value.SendGridKey;
                var client = new SendGridClient(apiKey);
                string emailTemplateHtml = _hostingEnvironment.ContentRootPath + "\\EmailTemplate\\EmailTemplateRefund.html";
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
                var customerEmail = customer.Email;
                var customerName = customer.FullName;
                var totalAmount = route.TotalAmount;
                var routeCode = route.Code;
                var routeTickets = _routeTicketRepository.GetAllQueryable()
                    .Where(r => r.RouteId == routeId && r.IsReplaced != true)
                    .OrderBy(r=> r.Order);
                var firstTicket = routeTickets.FirstOrDefault();
                var lastTicket = routeTickets.LastOrDefault();

                //replacing the required things  
                body = body.Replace("{customerName}", customerName);
                body = body.Replace("{subTotal}", remainRefund.ToString());
                body = body.Replace("{Total}", remainRefund.ToString());

                body = body.Replace("{refundTitle}", SETTING.Value.RefundTitle);
                body = body.Replace("{fromName}", SETTING.Value.FromName);

                using (StreamReader reader = new StreamReader(ticketTemplatehtml))
                {
                    var ticketRow = reader.ReadToEnd();
                    var departureStation = firstTicket.DepartureStation.Name;
                    var arrivalStation = lastTicket.ArrivalStation.Name;
                    var departureCity = firstTicket.DepartureStation.City.Name;
                    var arrivalCity = lastTicket.ArrivalStation.City.Name;
                    var departureDateTime = firstTicket.Ticket.DepartureDateTime;
                    var arrivalDateTime = lastTicket.Ticket.ArrivalDateTime;

                    ticketRow = ticketRow.Replace("{ticketCode}", routeCode);
                    ticketRow = ticketRow.Replace("{Description}", "");
                    ticketRow = ticketRow.Replace("{departureCity}", departureCity);
                    ticketRow = ticketRow.Replace("{departureStation}", departureStation);
                    ticketRow = ticketRow.Replace("{departureTime}", String.Format("{0:dddd, MMMM dd, yyyy HH:mm}", departureDateTime));
                    ticketRow = ticketRow.Replace("{arrivalCity}", arrivalCity);
                    ticketRow = ticketRow.Replace("{arrivalStation}", arrivalStation);
                    ticketRow = ticketRow.Replace("{arrivalTime}", String.Format("{0:dddd, MMMM dd, yyyy HH:mm}", arrivalDateTime));
                    ticketRow = ticketRow.Replace("{Amount}", remainRefund.ToString());

                    ticketList += ticketRow;
                }

                body = body.Replace("{ticketList}", ticketList);

                var from = new EmailAddress(SETTING.Value.FromEmail, SETTING.Value.FromName);
                var subject = routeCode + " - Receipt - Refund All";
                var to = new EmailAddress(customerEmail, customerName);
                var plainTextContent = "";
                var htmlContent = body;
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                client.SendEmailAsync(msg);
            }
            catch (Exception)
            {
            }
        }

        //Payout
        public void SendEmailReceiptForSeller(int ticketId, decimal amount)
        {
            try
            {
                var apiKey = SETTING.Value.SendGridKey;
                var client = new SendGridClient(apiKey);
                string emailTemplateHtml = _hostingEnvironment.ContentRootPath + "\\EmailTemplate\\EmailTemplateSeller.html";
                string ticketTemplatehtml = _hostingEnvironment.ContentRootPath + "\\EmailTemplate\\TicketsTemplate.html";
                string body = string.Empty;
                string ticketRow = string.Empty;
                var ticket = _ticketRepository.Get(r => r.Id == ticketId);
                var customer = _customerRepository.Get(c => c.Id == ticket.SellerId);
                //using streamreader for reading my htmltemplate   
                using (StreamReader reader = new StreamReader(emailTemplateHtml))
                {
                    body = reader.ReadToEnd();
                }
                var customerEmail = customer.Email;
                var customerName = customer.FullName;
                var customerPhone = customer.PhoneNumber;
                var ticketCode = ticket.TicketCode;
                var totalAmount = amount;
                var date = DateTime.UtcNow;
                var ticketRowViewModel = _mapper.Map<Ticket, TicketRowViewModel>(ticket);

                //replacing the required things  
                body = body.Replace("{ticketCode}", ticketCode);
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

                using (StreamReader reader = new StreamReader(ticketTemplatehtml))
                {
                    ticketRow = reader.ReadToEnd();
                    var departureStation = _stationRepository.Get(s => s.Id == ticketRowViewModel.DepartureStationId).Name;
                    var arrivalStation = _stationRepository.Get(s => s.Id == ticketRowViewModel.ArrivalStationId).Name;
                    ticketRow = ticketRow.Replace("{ticketCode}", ticketRowViewModel.TicketCode);
                    ticketRow = ticketRow.Replace("{Description}", ticketRowViewModel.Description);
                    ticketRow = ticketRow.Replace("{departureCity}", ticketRowViewModel.DepartureCity);
                    ticketRow = ticketRow.Replace("{departureStation}", departureStation);
                    ticketRow = ticketRow.Replace("{departureTime}", ticketRowViewModel.DepartureDateTime.ToString());
                    ticketRow = ticketRow.Replace("{arrivalCity}", ticketRowViewModel.ArrivalCity);
                    ticketRow = ticketRow.Replace("{arrivalStation}", arrivalStation);
                    ticketRow = ticketRow.Replace("{arrivalTime}", ticketRowViewModel.ArrivalDateTime.ToString());
                    ticketRow = ticketRow.Replace("{Amount}", amount.ToString());


                }
                body = body.Replace("{Ticket}", ticketRow);

                var from = new EmailAddress(SETTING.Value.FromEmail, SETTING.Value.FromName);
                var subject = ticketCode + " - Receipt - Payout";
                var to = new EmailAddress(customerEmail, customerName);
                var plainTextContent = "";
                var htmlContent = body;
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                client.SendEmailAsync(msg);
            }
            catch (Exception)
            {
            }
        }
        //Refund One Ticket
        public void SendEmailRefundForBuyerOneTicket(int ticketId)
        {
            try
            {
                var apiKey = SETTING.Value.SendGridKey;
                var client = new SendGridClient(apiKey);
                string emailTemplateHtml = _hostingEnvironment.ContentRootPath + "\\EmailTemplate\\EmailTemplateRefund.html";
                string ticketTemplatehtml = _hostingEnvironment.ContentRootPath + "\\EmailTemplate\\TicketsTemplate.html";
                string body = string.Empty;
                string ticketRow = string.Empty;
                var ticket = _ticketRepository.Get(r => r.Id == ticketId);
                var customer = _customerRepository.Get(c => c.Id == ticket.BuyerId);
                //using streamreader for reading my htmltemplate   
                using (StreamReader reader = new StreamReader(emailTemplateHtml))
                {
                    body = reader.ReadToEnd();
                }
                var customerEmail = customer.Email;
                var customerName = customer.FullName;
                var customerPhone = customer.PhoneNumber;
                var ticketCode = ticket.TicketCode;
                var totalAmount = ticket.SellingPrice;
                var date = DateTime.UtcNow;
                var ticketRowViewModel = _mapper.Map<Ticket, TicketRowViewModel>(ticket);

                //replacing the required things  
                body = body.Replace("{customerName}", customerName);
                body = body.Replace("{subTotal}", totalAmount.ToString());
                body = body.Replace("{Total}", totalAmount.ToString());

                body = body.Replace("{refundTitle}", SETTING.Value.RefundTitle);
                body = body.Replace("{fromName}", SETTING.Value.FromName);

                using (StreamReader reader = new StreamReader(ticketTemplatehtml))
                {
                    ticketRow = reader.ReadToEnd();
                    var departureStation = _stationRepository.Get(s => s.Id == ticketRowViewModel.DepartureStationId).Name;
                    var arrivalStation = _stationRepository.Get(s => s.Id == ticketRowViewModel.ArrivalStationId).Name;
                    ticketRow = ticketRow.Replace("{ticketCode}", ticketRowViewModel.TicketCode);
                    ticketRow = ticketRow.Replace("{Description}", ticketRowViewModel.Description);
                    ticketRow = ticketRow.Replace("{departureCity}", ticketRowViewModel.DepartureCity);
                    ticketRow = ticketRow.Replace("{departureStation}", departureStation);
                    ticketRow = ticketRow.Replace("{departureTime}", ticketRowViewModel.DepartureDateTime.ToString());
                    ticketRow = ticketRow.Replace("{arrivalCity}", ticketRowViewModel.ArrivalCity);
                    ticketRow = ticketRow.Replace("{arrivalStation}", arrivalStation);
                    ticketRow = ticketRow.Replace("{arrivalTime}", ticketRowViewModel.ArrivalDateTime.ToString());
                    ticketRow = ticketRow.Replace("{Amount}", ticketRowViewModel.SellingPrice.ToString());


                }
                body = body.Replace("{ticketList}", ticketRow);

                var from = new EmailAddress(SETTING.Value.FromEmail, SETTING.Value.FromName);
                var subject = ticketCode + " - Receipt - Refund";
                var to = new EmailAddress(customerEmail, customerName);
                var plainTextContent = "";
                var htmlContent = body;
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                client.SendEmailAsync(msg);
            }
            catch (Exception)
            {

            }
        }

        //Replacement ticket
        public void SendEmailReplacementForBuyer(int oldTicketId, int replacementTicketId)
        {
            try
            {
                var apiKey = SETTING.Value.SendGridKey;
                var client = new SendGridClient(apiKey);
                string emailTemplateHtml = _hostingEnvironment.ContentRootPath + "\\EmailTemplate\\EmailTemplateReplacement.html";
                string ticketTemplatehtml = _hostingEnvironment.ContentRootPath + "\\EmailTemplate\\TicketsTemplate.html";
                string body = string.Empty;
                string oldTicketRow = string.Empty;
                string replacementTicketRow = string.Empty;
                var oldTicket = _ticketRepository.Get(o => o.Id == oldTicketId);
                var replacementTicket = _ticketRepository.Get(r => r.Id == replacementTicketId);
                var customer = _customerRepository.Get(c => c.Id == replacementTicket.BuyerId);
                //using streamreader for reading my htmltemplate   
                using (StreamReader reader = new StreamReader(emailTemplateHtml))
                {
                    body = reader.ReadToEnd();
                }
                var customerEmail = customer.Email;
                var customerName = customer.FullName;
                var customerPhone = customer.PhoneNumber;
                var oldTicketCode = oldTicket.TicketCode;
                var replacementTicketCode = replacementTicket.TicketCode;
                var routeId = _routeTicketRepository.Get(r => r.TicketId == replacementTicket.Id).RouteId;
                var routeCode = _routeRepository.Get(r => r.Id == routeId).Code;
                var oldTotalAmount = oldTicket.SellingPrice;
                var replacementTotalAmount = replacementTicket.SellingPrice;
                var totalAmount = oldTotalAmount - replacementTotalAmount;
                var date = DateTime.UtcNow;
                var oldTicketRowViewModel = _mapper.Map<Ticket, TicketRowViewModel>(oldTicket);
                var replacementTicketRowViewModel = _mapper.Map<Ticket, TicketRowViewModel>(replacementTicket);

                //replacing the required things  
                body = body.Replace("{oldTicketCode}", oldTicketCode);
                body = body.Replace("{replaceTicketCode}", replacementTicketCode);
                body = body.Replace("{customerName}", customerName);
                body = body.Replace("{customerEmail}", customerEmail);
                body = body.Replace("{customerPhone}", customerPhone);
                body = body.Replace("{Date}", date.ToString());
                body = body.Replace("{oldSubTotal}", oldTotalAmount.ToString());
                body = body.Replace("{replaceSubTotal}", replacementTotalAmount.ToString());

                body = body.Replace("{Total}", totalAmount.ToString());

                body = body.Replace("{Term}", SETTING.Value.Term);
                body = body.Replace("{Title}", SETTING.Value.ReplacementTitle);
                body = body.Replace("{fromName}", SETTING.Value.FromName);
                body = body.Replace("{fromEmail}", SETTING.Value.FromEmail);
                body = body.Replace("{Street}", SETTING.Value.Street);
                body = body.Replace("{City}", SETTING.Value.City);
                body = body.Replace("{addressNumber}", SETTING.Value.AddressNumber);
                body = body.Replace("{phoneNumber}", SETTING.Value.PhoneNumber);
                body = body.Replace("{bussinessNumber}", SETTING.Value.BussinessNumber);
                //Old ticket
                using (StreamReader reader = new StreamReader(ticketTemplatehtml))
                {
                    oldTicketRow = reader.ReadToEnd();
                    var departureStation = _stationRepository.Get(s => s.Id == oldTicketRowViewModel.DepartureStationId).Name;
                    var arrivalStation = _stationRepository.Get(s => s.Id == oldTicketRowViewModel.ArrivalStationId).Name;
                    oldTicketRow = oldTicketRow.Replace("{ticketCode}", oldTicketRowViewModel.TicketCode);
                    oldTicketRow = oldTicketRow.Replace("{Description}", oldTicketRowViewModel.Description);
                    oldTicketRow = oldTicketRow.Replace("{departureCity}", oldTicketRowViewModel.DepartureCity);
                    oldTicketRow = oldTicketRow.Replace("{departureStation}", departureStation);
                    oldTicketRow = oldTicketRow.Replace("{departureTime}", oldTicketRowViewModel.DepartureDateTime.ToString());
                    oldTicketRow = oldTicketRow.Replace("{arrivalCity}", oldTicketRowViewModel.ArrivalCity);
                    oldTicketRow = oldTicketRow.Replace("{arrivalStation}", arrivalStation);
                    oldTicketRow = oldTicketRow.Replace("{arrivalTime}", oldTicketRowViewModel.ArrivalDateTime.ToString());
                    oldTicketRow = oldTicketRow.Replace("{Amount}", oldTicketRowViewModel.SellingPrice.ToString());
                }
                //Replace ticket
                using (StreamReader reader = new StreamReader(ticketTemplatehtml))
                {
                    replacementTicketRow = reader.ReadToEnd();
                    var departureStation = _stationRepository.Get(s => s.Id == replacementTicketRowViewModel.DepartureStationId).Name;
                    var arrivalStation = _stationRepository.Get(s => s.Id == replacementTicketRowViewModel.ArrivalStationId).Name;
                    replacementTicketRow = replacementTicketRow.Replace("{ticketCode}", replacementTicketRowViewModel.TicketCode);
                    replacementTicketRow = replacementTicketRow.Replace("{Description}", replacementTicketRowViewModel.Description);
                    replacementTicketRow = replacementTicketRow.Replace("{departureCity}", replacementTicketRowViewModel.DepartureCity);
                    replacementTicketRow = replacementTicketRow.Replace("{departureStation}", departureStation);
                    replacementTicketRow = replacementTicketRow.Replace("{departureTime}", replacementTicketRowViewModel.DepartureDateTime.ToString());
                    replacementTicketRow = replacementTicketRow.Replace("{arrivalCity}", replacementTicketRowViewModel.ArrivalCity);
                    replacementTicketRow = replacementTicketRow.Replace("{arrivalStation}", arrivalStation);
                    replacementTicketRow = replacementTicketRow.Replace("{arrivalTime}", replacementTicketRowViewModel.ArrivalDateTime.ToString());
                    replacementTicketRow = replacementTicketRow.Replace("{Amount}", replacementTicketRowViewModel.SellingPrice.ToString());
                }
                
                body = body.Replace("{oldTicket}", oldTicketRow);
                body = body.Replace("{replaceTicket}", replacementTicketRow);

                var from = new EmailAddress(SETTING.Value.FromEmail, SETTING.Value.FromName);
                var subject = routeCode + " - Receipt - Replacement";
                var to = new EmailAddress(customerEmail, customerName);
                var plainTextContent = "";
                var htmlContent = body;
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                client.SendEmailAsync(msg);
            }
            catch (Exception)
            {
            }
        }

    }
}
