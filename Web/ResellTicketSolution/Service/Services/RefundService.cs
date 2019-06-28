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
    public interface IRefundService
    {
        string RefundMoneyToCustomer(int TicketId);
    }
    public class RefundService : IRefundService
    {
        private readonly IRefundRepository _refundRepository;
        private readonly IRouteTicketRepository _routeTicketRepository;
        private readonly IPaymentRepository _paymentRepository;
        private readonly ITicketRepository _ticketRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOptions<CrediCardSetting> SETTING;

        public RefundService()
        {
        }

        public RefundService(IRefundRepository refundRepository, IRouteTicketRepository routeTicketRepository, ITicketRepository ticketRepository,
        IPaymentRepository paymentRepository, IMapper mapper, IUnitOfWork unitOfWork, IOptions<CrediCardSetting> options)
        {
            _refundRepository = refundRepository;
            _routeTicketRepository = routeTicketRepository;
            _paymentRepository = paymentRepository;
            _ticketRepository = ticketRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            SETTING = options;
        }

        public string RefundMoneyToCustomer(int TicketId)
        {
            // lấy route ứng vs ticketId 
            var routeTicket = _routeTicketRepository.Get(x => x.TicketId == TicketId & x.Deleted == false);
            
            //lấy Lịch sử chagre tiền
            var paymentDetail = _paymentRepository.Get(x => x.RouteId == routeTicket.RouteId);

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
            var refundAddIntoData = _mapper.Map<RefundCreateViewModel, Core.Models.Refund>(refundCreate);
            _refundRepository.Add(refundAddIntoData);
            _unitOfWork.CommitChanges();
            return "";
        }
    }
}
