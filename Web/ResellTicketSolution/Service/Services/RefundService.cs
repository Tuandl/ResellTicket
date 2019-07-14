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
using Service.NotificationService;

namespace Service.Services
{
    public interface IRefundService
    {
        string RefundToTalMoneyToCustomer(int TicketId, ResolveOption? resolveOption = null);

        void RefundFailTicketMoneyToCustomer(int failTicketId, ResolveOption? resolveOption = null);
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

        public RefundService()
        {
        }

        public RefundService(IRefundRepository refundRepository, IRouteTicketRepository routeTicketRepository, ITicketRepository ticketRepository,
        IPaymentRepository paymentRepository, IMapper mapper, IUnitOfWork unitOfWork, IOptions<CrediCardSetting> options,
        IOneSignalService oneSignalService, IPayoutRepository payoutRespository)
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
        }

        public string RefundToTalMoneyToCustomer(int TicketId, ResolveOption? resolveOption = null)
        {
            // lấy routeTicket ứng vs ticketId 
            var routeTicket = _routeTicketRepository.Get(x => 
                x.TicketId == TicketId &
                x.Deleted == false & 
                x.Route.Status == RouteStatus.Bought
            );

            //lấy Lịch sử chagre tiền
            var paymentDetail = _paymentRepository.Get(x => x.RouteId == routeTicket.RouteId && x.Route.Deleted == false);

            //refund lại tiền
            StripeConfiguration.SetApiKey(SETTING.Value.SecretStripe);

            var refundOptions = new RefundCreateOptions()
            {
                ChargeId = paymentDetail.StripeChargeId
            };
            var refundService = new Stripe.RefundService();
            Stripe.Refund refund = refundService.Create(refundOptions);
            RefundCreateViewModel refundCreate = new RefundCreateViewModel();
            refundCreate.PaymentId = paymentDetail.Id;
            refundCreate.StripeRefundId = refund.Id;
            refundCreate.Amount = paymentDetail.Amount;
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
            route.ResolveOption = resolveOption;

            _unitOfWork.CommitChanges();
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

        public void RefundFailTicketMoneyToCustomer(int failTicketId, ResolveOption? resolveOption = null)
        {
            // lấy routeTicket ứng vs ticketId 
            var failRouteTicket = _routeTicketRepository.Get(x =>
                x.TicketId == failTicketId &
                x.Deleted == false &
                x.Route.Status == RouteStatus.Bought
            );
            var paymentDetail = _paymentRepository.Get(x => x.RouteId == failRouteTicket.RouteId && x.Route.Deleted == false);
            var failTicket = _ticketRepository.Get(x => x.Id == failTicketId && x.Deleted == false);
            StripeConfiguration.SetApiKey(SETTING.Value.SecretStripe);

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
            refundAddIntoData.Amount = failTicket.SellingPrice;
            refundAddIntoData.Status = RefundStatus.Success;
            _refundRepository.Add(refundAddIntoData);

            var route = failRouteTicket.Route;
            var failTickets = 0;
            var refundFailTickets = 0;
            foreach(var routeTicket in route.RouteTickets)
            {
                if (routeTicket.Ticket.Status == TicketStatus.RenamedFail) failTickets++;
                if (_payoutRespository.Get(x => x.TicketId == routeTicket.TicketId 
                    && x.Ticket.Status == TicketStatus.RenamedFail) != null) refundFailTickets++;
            }
            if(failTickets == refundFailTickets)
            {
                route.Status = RouteStatus.Completed;
                route.ResolveOption = resolveOption;
            }

            _unitOfWork.CommitChanges();
        }
    }
}
