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

        void ChargeAfterReplaceTicket(Ticket failTicket, Ticket replaceTicket, int routeId);
    }
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        //private readonly ICreditCardService _creditCardService;
        private readonly ICreditCardRepository _creditCardRepository;
        //private readonly ICustomerService _customerService;
        //private readonly IRouteService _routeService;
        private readonly ICustomerRepository _customerRepository;
        private readonly IRouteRepository _routeRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOptions<CrediCardSetting> SETTING;

        //ICreditCardService creditCardService, IRouteService routeService,
        //    ICustomerService customerService
        public PaymentService(IPaymentRepository paymentRepository, IMapper mapper, IUnitOfWork unitOfWork, IOptions<CrediCardSetting> options,
            ICustomerRepository customerRepository, IRouteRepository routeRepository, ICreditCardRepository creditCardRepository)
        {
            _paymentRepository = paymentRepository;
            //_creditCardService = creditCardService;
            //_customerService = customerService;
            //_routeService = routeService;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            SETTING = options;
            _customerRepository = customerRepository;
            _routeRepository = routeRepository;
            _creditCardRepository = creditCardRepository;
        }

        public PaymentRowViewModel GetPaymentDetailByRouteId(int RouteId)
        {
            var payment = _paymentRepository.Get(x => x.Deleted == false && x.RouteId == RouteId);
            var paymentRowViewModel = _mapper.Map<Payment, PaymentRowViewModel>(payment);

            return paymentRowViewModel;
        }

        public string MakePayment(int RouteId)
        {
            //var routeToMakePayment = _routeService.getRouteDetail(RouteId);
            //var customerInfor = _customerService.FindCustomerById(routeToMakePayment.CutomerId);
            //var creditCardToMakePayment = _creditCardService.GetCardToPayment(routeToMakePayment.CustomerId);
            var routeToMakePayment = _routeRepository.Get(x => x.Id == RouteId);
            var customerInfor = _customerRepository.Get(x => x.Id == routeToMakePayment.CustomerId);
            var creditCardToMakePayment = _creditCardRepository.Get(x => x.Deleted == false && x.CustomerId == routeToMakePayment.CustomerId && x.Isdefault == true);

            //Stripe charge money
            StripeConfiguration.SetApiKey(SETTING.Value.SecretStripe);

            var options = new ChargeCreateOptions
            {
                Amount = Convert.ToInt64(routeToMakePayment.TotalAmount * 100),
                Currency = "usd",
                Description = customerInfor.FullName.ToUpper() + "-" + customerInfor.Email + "-" + customerInfor.PhoneNumber +
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
            model.Description = "You bought route " + routeToMakePayment.Code + ". Thank you for using our service.";
            model.Amount = routeToMakePayment.TotalAmount;
            model.Status = PaymentStatus.Success;
            model.StripeChargeId = charge.Id;
            model.FeeAmount = Convert.ToDecimal(charge.BalanceTransaction.Fee) / 100;
            var payment = _mapper.Map<PaymentCreateViewModel, Payment>(model); //map từ ViewModel qua Model
            _paymentRepository.Add(payment);
            _unitOfWork.CommitChanges();
            return "";
        }

        public void ChargeAfterReplaceTicket(Ticket failTicket, Ticket replaceTicket, int routeId)
        {
            var route = _routeRepository.Get(x => x.Id == routeId);
            var creditCardToMakePayment = _creditCardRepository.Get(x => x.Deleted == false && x.CustomerId == route.CustomerId && x.Isdefault == true);
            var amount = replaceTicket.SellingPrice - failTicket.SellingPrice;
            //Stripe charge money
            StripeConfiguration.SetApiKey(SETTING.Value.SecretStripe);

            var options = new ChargeCreateOptions
            {
                Amount = Convert.ToInt64(amount * 100),
                Currency = "usd",
                Description = "Replace with higher price ticket",
                SourceId = creditCardToMakePayment.CardId, // obtained with Stripe.js,
                CustomerId = route.Customer.StripeId,
            };

            var service = new ChargeService();
            service.ExpandBalanceTransaction = true;
            Charge charge = service.Create(options);
            Payment payment = new Payment()
            {
                RouteId = routeId,
                CreditCartId = creditCardToMakePayment.Id,
                Description = "You replaced ticket " + failTicket.TicketCode + " by ticket " + replaceTicket.TicketCode + ".",
                Amount = amount,
                Status = PaymentStatus.Success,
                StripeChargeId = charge.Id,
                FeeAmount = Convert.ToDecimal(charge.BalanceTransaction.Fee) / 100
            };
            _paymentRepository.Add(payment);

        }
    }
}
