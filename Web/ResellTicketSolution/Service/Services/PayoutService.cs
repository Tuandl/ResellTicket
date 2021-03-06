﻿using System;
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
using Service.EmailService;
using Service.NotificationService;

namespace Service.Services
{

    public interface IPayoutService
    {
        string MakePayoutToCustomer(int TicketId, string username);
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
        private readonly IUserRepository _userRepository;
        private readonly IResolveOptionLogRepository _resolveOptionLogRepository;
        private readonly ISendGridService _sendGridService;
        private readonly IOneSignalService _oneSignalService;
        private readonly INotificationService _notificationService;

        public PayoutService(IPayoutRepository payoutRepository, 
            ITicketRepository ticketRepository, 
            IMapper mapper, 
            IUnitOfWork unitOfWork,
            ICustomerRepository customerRepository,
            ICreditCardRepository creditCardRepository,
            IRouteTicketRepository routeTicketRepository,
            IPaymentRepository paymentRepository,
            IRouteRepository routeRepository,
            IOptions<CrediCardSetting> options,
            IUserRepository userRepository,
            IResolveOptionLogRepository resolveOptionLogRepository,
            ISendGridService sendGridService,
            IOneSignalService oneSignalService,
            INotificationService notificationService) 
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
            _userRepository = userRepository;
            _resolveOptionLogRepository = resolveOptionLogRepository;
            _sendGridService = sendGridService;
            _oneSignalService = oneSignalService;
            _notificationService = notificationService;
        }

        public string MakePayoutToCustomer(int TicketId, string username)
        {
            string staffId = _userRepository.Get(x => x.UserName == username).Id;

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
            var ticket = _ticketRepository.Get(x => x.Id == TicketId && x.Deleted == false);
            if(ticket.Status == TicketStatus.Completed)
            {
                throw new InvalidOperationException();
            }
            _unitOfWork.StartTransaction();
            ticket.Status = TicketStatus.Completed;
            _ticketRepository.Update(ticket);
            _unitOfWork.CommitChanges();

            //make payout
            var paymentDetail = _paymentRepository.Get(x => x.RouteId == route.Id && x.Deleted == false);
            StripeConfiguration.SetApiKey(SETTING.Value.SecretStripe);
            var amount = ticket.SellingPrice * (100 - ticket.CommissionPercent) / 100;

            //số tiền chuyển đi
            var options = new TransferCreateOptions
            {
                Amount = Convert.ToInt64(amount * 100),
                Currency = "usd",
                Destination = ticket.Seller.StripeConnectAccountId,
                SourceTransaction = paymentDetail.StripeChargeId,
                Description = "Transfer for Ticket Code: " + ticket.TicketCode
            };

            var service = new TransferService();
            Transfer Transfer = service.Create(options);

            Core.Models.Payout payoutCreateIntoDatabase = new Core.Models.Payout();
            payoutCreateIntoDatabase.StripePayoutId = Transfer.Id;
            payoutCreateIntoDatabase.TicketId = TicketId;
            payoutCreateIntoDatabase.PaymentId = paymentDetail.Id;
            payoutCreateIntoDatabase.Amount = amount;
            payoutCreateIntoDatabase.FeeAmount = ticket.SellingPrice * (ticket.CommissionPercent / 100);
            payoutCreateIntoDatabase.Description = "You receive money for ticket " + ticket.TicketCode + ". Thank you for using our service.";
            payoutCreateIntoDatabase.Status = PayoutStatus.Success;
            _payoutRepository.Add(payoutCreateIntoDatabase);

            //make payout

            //save log
            //_unitOfWork.StartTransaction();
            ResolveOptionLog log = new ResolveOptionLog()
            {
                Option = ResolveOption.PAYOUT,
                RouteId = route.Id,
                TicketId = TicketId,
                StaffId = staffId,
                Amount = amount
            };
            _resolveOptionLogRepository.Add(log);
            _unitOfWork.CommitChanges();

            if (route.ResolveOptionLogs.Count() == route.RouteTickets.Where(x => x.Deleted == false).Count())
            {
                route.Status = RouteStatus.Completed;
                _routeRepository.Update(route);
            }
            _unitOfWork.CommitTransaction();
            //save log

            //push noti to buyer
            var message = "Ticket " + ticket.TicketCode + " has been payout. $" +
                (amount).ToString("N2") + " has been tranfered to your Stripe account.";
            var sellerDevices = ticket.Seller.CustomerDevices.Where(x => x.IsLogout == false);
            List<string> sellerDeviceIds = new List<string>();
            foreach (var sellerDev in sellerDevices)
            {
                sellerDeviceIds.Add(sellerDev.DeviceId);
            }
            //push noti
            _oneSignalService.PushNotificationCustomer(message, sellerDeviceIds);

            //Save Notification
            _notificationService.SaveNotification(
                customerId: ticket.SellerId,
                type: NotificationType.TicketIsPayouted,
                message: $"Ticket {ticket.TicketCode} has been payout. ${(amount).ToString("N2")} has been transfered to your Stripe account.",
                data: new { ticketId = ticket.Id, });

            //send Email
            _sendGridService.SendEmailReceiptForSeller(TicketId, amount);

            return "";
        }
    }
}
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