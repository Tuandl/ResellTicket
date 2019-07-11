using System;
using System.Collections.Generic;
using System.Text;
using AutoMapper;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using Stripe;
using ViewModel.ViewModel.RouteTicket;
using ViewModel.ViewModel.Refund;
using ViewModel.AppSetting;
using Microsoft.Extensions.Options;
using System.Linq;
using Core.Enum;

namespace Service.Services
{

    public interface IPayoutService
    {
        string MakePayoutToCustomer(int TicketId);
    }
    public class PayoutService : IPayoutService
    {
        private readonly IPayoutRepository _payoutRepository;
        private readonly ITicketRepository _ticketRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly ICreditCardRepository _creditCardRepository;
        private readonly IRouteTicketRepository _routeTicketRepository;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IRouteRepository _routeRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOptions<CrediCardSetting> SETTING;
        public PayoutService(IPayoutRepository payoutRepository, ITicketRepository ticketRepository, IMapper mapper, IUnitOfWork unitOfWork,
            ICustomerRepository customerRepository, ICreditCardRepository creditCardRepository, IRouteTicketRepository routeTicketRepository,
            IPaymentRepository paymentRepository, IRouteRepository routeRepository, IOptions<CrediCardSetting> options)
        {
            _payoutRepository = payoutRepository;
            _ticketRepository = ticketRepository;
            _customerRepository = customerRepository;
            _creditCardRepository = creditCardRepository;
            _routeRepository = routeRepository;
            _routeTicketRepository = routeTicketRepository;
            _paymentRepository = paymentRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            SETTING = options;
        }

        public string MakePayoutToCustomer(int TicketId)
        {

            bool isRouteValid = true;
            int routeId = -1;

            //lấy all routeTicke ứng vs cái Ticket
            ///// CÁCH 1
            var route =
                (from ROUTE in _routeRepository.GetAllQueryable()

                 join RT in _routeTicketRepository.GetAllQueryable()
                 on ROUTE.Id equals RT.RouteId

                 where ROUTE.Deleted == false &&
                     RT.Deleted == false &&
                     ROUTE.Status == RouteStatus.Bought &&
                     RT.TicketId == TicketId

                 select ROUTE)
                .FirstOrDefault();
            if (route == null) return "Not found Route";

            /////  --> CÁCH 2 <---
            //List<RouteTicket> routeTicketAll = _routeTicketRepository.GetAllQueryable()
            //    .Where(x =>
            //        x.TicketId == TicketId &&
            //        x.Deleted == false
            //    ).ToList();

            //foreach(var routeTicket in routeTicketAll)
            //{
            //    //lấy ra cái route oke
            //    List<RouteTicket> routeTicketTmp = _routeTicketRepository.GetAllQueryable().Where(x => x.RouteId == routeTicket.RouteId).ToList();
            //    foreach(var route in routeTicketTmp)
            //    {
            //        if(route.Ticket.Status != TicketStatus.Completed)
            //        {
            //            isRouteValid = false;
            //            routeId = -1;
            //        }
            //        routeId = route.Id;
            //    }
            //}


            //
            var paymentDetail = _paymentRepository.Get(x => x.RouteId == route.Id);
            var ticket = _ticketRepository.Get(x => x.Id == TicketId);
            StripeConfiguration.SetApiKey(SETTING.Value.SecretStripe);
            var amount = ticket.SellingPrice * (100 - ticket.CommissionPercent) / 100;

            //số tiền chuyển đi
            var options = new TransferCreateOptions
            {
                Amount = Convert.ToInt64(amount) * 100,
                Currency = "usd",
                Destination = ticket.Seller.StripeConnectAccountId,
                SourceTransaction = paymentDetail.StripeChargeId
            };

            var service = new TransferService();
            Transfer Transfer = service.Create(options);

            Core.Models.Payout payoutCreateIntoDatabase = new Core.Models.Payout();
            payoutCreateIntoDatabase.StripePayoutId = Transfer.Id;
            payoutCreateIntoDatabase.TicketId = TicketId;
            payoutCreateIntoDatabase.PaymentId = paymentDetail.Id;
            payoutCreateIntoDatabase.Amount = Transfer.Amount;
            payoutCreateIntoDatabase.FeeAmount = ticket.CommissionPercent;
            payoutCreateIntoDatabase.Status = PayoutStatus.Success;
            _payoutRepository.Add(payoutCreateIntoDatabase);

            ticket.Status = TicketStatus.Completed;
            _ticketRepository.Update(ticket);
            int renanmedSuccessTickets = route.RouteTickets.Where(x => x.Ticket.Status == TicketStatus.Completed && x.Deleted == false).Count();
            if (renanmedSuccessTickets == route.RouteTickets.Count(x => x.Deleted == false))
            {
                route.Status = RouteStatus.Completed;
                _routeRepository.Update(route);
            }

            _unitOfWork.CommitChanges();

            return "";
        }
    }
}
