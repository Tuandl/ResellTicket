using System;
using System.Collections.Generic;
using System.Text;
using AutoMapper;
using Core.Infrastructure;
using Core.Models;
using Core.Enum;
using Core.Repository;
using ViewModel.ViewModel.Payment;
using ViewModel.AppSetting;
using Microsoft.Extensions.Options;
using Stripe;

namespace Service.Services
{
    public interface IPaymentService
    {
        string MakePayment(int RouteId);
        PaymentRowViewModel GetPaymentDetailByRouteId(int RouteId);

    }
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly ICreditCardService _creditCardService;
        private readonly ICustomerService _customerService;
        private readonly IRouteService _routeService;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOptions<CrediCardSetting> SETTING;

        public PaymentService(IPaymentRepository paymentRepository, ICreditCardService creditCardService, IRouteService routeService,
            ICustomerService customerService, IMapper mapper, IUnitOfWork unitOfWork, IOptions<CrediCardSetting> options)
        {
            _paymentRepository = paymentRepository;
            _creditCardService = creditCardService;
            _customerService = customerService;
            _routeService = routeService;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            SETTING = options;
        }

        public PaymentRowViewModel GetPaymentDetailByRouteId(int RouteId)
        {
            var payment = _paymentRepository.Get(x => x.Deleted == false && x.RouteId == RouteId);
            var paymentRowViewModel = _mapper.Map<Payment, PaymentRowViewModel>(payment);

            return paymentRowViewModel;
        }

        public string MakePayment(int RouteId)
        {
            var routeToMakePayment = _routeService.GetRouteDetail(RouteId);
            var customerInfor = _customerService.FindCustomerById(routeToMakePayment.CustomerId);
            var creditCardToMakePayment = _creditCardService.GetCardToPayment(routeToMakePayment.CustomerId);

            //Stripe charge money
            StripeConfiguration.SetApiKey(SETTING.Value.SecretStripe);

            var options = new ChargeCreateOptions
            {
                Amount = Convert.ToInt64(routeToMakePayment.TotalAmount * 100),
                Currency = "usd",
                Description = customerInfor.FullName + "-" + customerInfor.Email + "-" +customerInfor.PhoneNumber + 
                    " buy Route Code: " + routeToMakePayment.Code,
                SourceId = creditCardToMakePayment.CardId, // obtained with Stripe.js,
                CustomerId = customerInfor.StripeId,
                
            };
            var service = new ChargeService();
            service.ExpandBalanceTransaction = true;
            Charge charge = service.Create(options);


            PaymentCreateViewModel model = new PaymentCreateViewModel();
            model.RouteId = routeToMakePayment.Id;
            model.CreditCartId = creditCardToMakePayment.Id;
            model.Description = charge.Description;
            model.Amount = routeToMakePayment.TotalAmount;
            model.Status = PaymentStatus.Success;
            model.StripeChargeId = charge.Id;
            model.FeeAmount = Convert.ToDecimal(charge.BalanceTransaction.Fee)/100;
            var payment = _mapper.Map<PaymentCreateViewModel, Payment>(model); //map từ ViewModel qua Model
            _paymentRepository.Add(payment);
            _unitOfWork.CommitChanges();
            return "";
        }
    }
}
