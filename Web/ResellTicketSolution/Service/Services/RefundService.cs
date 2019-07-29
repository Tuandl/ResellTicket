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
using Service.NotificationService;
using Microsoft.AspNetCore.Identity;
using Service.EmailService;

namespace Service.Services
{
    public interface IRefundService
    {
        string RefundToTalMoneyToCustomer(int TicketId, ResolveOption resolveOption, string username);

        void RefundFailTicketMoneyToCustomer(int failTicketId, ResolveOption resolveOption, string userName);
    }
    public class RefundService : IRefundService
    {
        private readonly IRefundRepository _refundRepository;
        private readonly IPayoutRepository _payoutRespository;
        private readonly IRouteTicketRepository _routeTicketRepository;
        private readonly IPaymentRepository _paymentRepository;
        private readonly ITicketRepository _ticketRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOptions<CrediCardSetting> SETTING;
        private readonly IOneSignalService _oneSignalService;
        private readonly IResolveOptionLogRepository _resolveOptionLogRepository;
        private readonly IUserRepository _userRepository;
        private readonly IRouteRepository _routeRepository;
        private readonly ISendGridService _sendGridService;

        public RefundService()
        {
        }

        public RefundService(IRefundRepository refundRepository, IRouteTicketRepository routeTicketRepository, ITicketRepository ticketRepository,
        IPaymentRepository paymentRepository, IMapper mapper, IUnitOfWork unitOfWork, IOptions<CrediCardSetting> options,
        IOneSignalService oneSignalService, IPayoutRepository payoutRespository, IResolveOptionLogRepository resolveOptionLogRepository,
        IUserRepository userRepository, IRouteRepository routeRepository, ISendGridService sendGridService)
        {
            _refundRepository = refundRepository;
            _routeTicketRepository = routeTicketRepository;
            _paymentRepository = paymentRepository;
            _ticketRepository = ticketRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            SETTING = options;
            _oneSignalService = oneSignalService;
            _payoutRespository = payoutRespository;
            _resolveOptionLogRepository = resolveOptionLogRepository;
            _userRepository = userRepository;
            _routeRepository = routeRepository;
            _sendGridService = sendGridService;
        }

        public string RefundToTalMoneyToCustomer(int TicketId, ResolveOption resolveOption, string username)
        {
            string staffId = _userRepository.Get(x => x.UserName == username).Id;
            // lấy routeTicket ứng vs ticketId 
            var routeTicket = _routeTicketRepository.Get(x =>
                x.TicketId == TicketId &
                x.Deleted == false &
                x.Route.Status == RouteStatus.Bought
            );

            //lấy Lịch sử chagre tiền
            var paymentDetail = _paymentRepository.Get(x => x.RouteId == routeTicket.RouteId && x.Route.Deleted == false);
            var refundFromPayments = _refundRepository.GetAllQueryable().Where(x => x.PaymentId == paymentDetail.Id);
            decimal totalRefund = 0;
            foreach (var refundFromPayment in refundFromPayments)
            {
                totalRefund = totalRefund + refundFromPayment.Amount;
            }
            //refund lại tiền
            StripeConfiguration.SetApiKey(SETTING.Value.SecretStripe);

            //cmt để test
            decimal remainRefund = paymentDetail.Amount - totalRefund;
            var refundOptions = new RefundCreateOptions()
            {
                ChargeId = paymentDetail.StripeChargeId,
                Amount = Convert.ToInt64(remainRefund * 100)
            };
            var refundService = new Stripe.RefundService();
            Stripe.Refund refund = refundService.Create(refundOptions);
            RefundCreateViewModel refundCreate = new RefundCreateViewModel();
            refundCreate.PaymentId = paymentDetail.Id;
            refundCreate.StripeRefundId = refund.Id;
            refundCreate.Amount = refund.Amount / 100; //refund all 
            refundCreate.Description = "You have a refund for route " + routeTicket.Route.Code + ". We are sorry for the inconvenience.";

            refundCreate.Status = RefundStatus.Success;
            var refundAddIntoData = _mapper.Map<RefundCreateViewModel, Core.Models.Refund>(refundCreate);
            _refundRepository.Add(refundAddIntoData);

            foreach (var boughtTicket in routeTicket.Route.RouteTickets)
            {
                var ticket = boughtTicket.Ticket;
                if (ticket.Status == TicketStatus.Bought)
                {
                    ticket.Status = TicketStatus.Valid;
                    //ticket.BuyerId = null;
                    _ticketRepository.Update(ticket);
                    var message = "Buyer has canceled the transaction, ticket " + ticket.TicketCode + " is valid again.";
                    List<string> sellerDeviceIds = GetCustomerDeviceIds(ticket, true);
                    _oneSignalService.PushNotificationCustomer(message, sellerDeviceIds);
                }
            }
            var route = routeTicket.Route;
            route.Status = RouteStatus.Completed;
            route.IsRefundAll = true;
            //route.ResolveOption = resolveOption;
            _routeRepository.Update(route);

            var routeTickets = route.RouteTickets.Where(x => x.Deleted == false);
            foreach (var rt in routeTickets)
            {
                var resolveOptionLog = _resolveOptionLogRepository.Get(x => x.RouteId == rt.RouteId && x.TicketId == rt.TicketId);
                if (resolveOptionLog == null || resolveOptionLog.Option == ResolveOption.PAYOUT)
                {
                    ResolveOptionLog newLog = new ResolveOptionLog()
                    {
                        RouteId = rt.RouteId,
                        TicketId = rt.TicketId,
                        StaffId = staffId,
                        Option = ResolveOption.REFUNDTOTALAMOUNT,
                        Amount = rt.Ticket.SellingPrice
                    };
                    _resolveOptionLogRepository.Add(newLog);
                }
            }

            _unitOfWork.CommitChanges();

            _sendGridService.SendEmailRefundForBuyerAllTicket(routeTicket.RouteId);
            return "";
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

        public void RefundFailTicketMoneyToCustomer(int failTicketId, ResolveOption resolveOption, string userName)
        {
            string staffId = _userRepository.Get(x => x.UserName == userName).Id;
            // lấy routeTicket ứng vs ticketId 
            var failRouteTicket = _routeTicketRepository.Get(x =>
                x.TicketId == failTicketId &
                x.Deleted == false &
                x.Route.Status == RouteStatus.Bought
            );
            var paymentDetail = _paymentRepository.Get(x => x.RouteId == failRouteTicket.RouteId && x.Route.Deleted == false);
            var failTicket = _ticketRepository.Get(x => x.Id == failTicketId && x.Deleted == false);
            StripeConfiguration.SetApiKey(SETTING.Value.SecretStripe);

            //cmt để test
            //số tiền vé fail chuyền về lại cho buyer
            var refundOptions = new RefundCreateOptions()
            {
                ChargeId = paymentDetail.StripeChargeId,
                Amount = Convert.ToInt64(failTicket.SellingPrice * 100)
            };
            var refundService = new Stripe.RefundService();
            Stripe.Refund refund = refundService.Create(refundOptions);
            Core.Models.Refund refundAddIntoData = new Core.Models.Refund();
            refundAddIntoData.PaymentId = paymentDetail.Id;
            refundAddIntoData.StripeRefundId = refund.Id;
            refundAddIntoData.Description = "You have a refund for ticket " + failRouteTicket.Ticket.TicketCode + " in route " + failRouteTicket.Route.Code
                                    + ". We sorry for the inconvenience.";
            refundAddIntoData.Amount = failTicket.SellingPrice;
            refundAddIntoData.Status = RefundStatus.Success;
            _refundRepository.Add(refundAddIntoData);

            var route = failRouteTicket.Route;
            _unitOfWork.StartTransaction();
            ResolveOptionLog log = new ResolveOptionLog()
            {
                Option = resolveOption,
                RouteId = route.Id,
                TicketId = failTicket.Id,
                StaffId = staffId,
                Amount = refund.Amount / 100
            };
            _resolveOptionLogRepository.Add(log);
            _unitOfWork.CommitChanges();

            if (route.ResolveOptionLogs.Count() == route.RouteTickets.Where(x => x.Deleted == false).Count())
            {
                route.Status = RouteStatus.Completed;
                _routeRepository.Update(route);
            }

            //var refundFailTickets = 0;
            //var routeTickets = route.RouteTickets.Where(x => x.Deleted == false && x.Ticket.Status == TicketStatus.RenamedFail);
            //foreach(var routeTicket in routeTickets)
            //{
            //    if (_resolveOptionLogRepository.Get(x => x.TicketId == routeTicket.TicketId) != null) refundFailTickets++;
            //}
            //if(refundFailTickets == routeTickets.Count())
            //{
            //    route.Status = RouteStatus.Completed;
            //    _routeRepository.Update(route);
            //}

            _unitOfWork.CommitTransaction();

            _sendGridService.SendEmailRefundForBuyerOneTicket(failTicketId);
        }
    }
}
