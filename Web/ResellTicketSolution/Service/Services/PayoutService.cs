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
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOptions<CrediCardSetting> SETTING;
        public PayoutService(IPayoutRepository payoutRepository, ITicketRepository ticketRepository, IMapper mapper, IUnitOfWork unitOfWork,
            ICustomerRepository customerRepository, ICreditCardRepository creditCardRepository, IOptions<CrediCardSetting> options)
        {
            _payoutRepository = payoutRepository;
            _ticketRepository = ticketRepository;
            _customerRepository = customerRepository;
            _creditCardRepository = creditCardRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            SETTING = options;
        }

        public string MakePayoutToCustomer(int TicketId)
        {
            //var existedTicket = _ticketRepository.Get(x => x.Id == TicketId);
            //if (existedTicket == null)
            //{
            //    return "Not found ticket";
            //}

            //var creditCard = _creditCardRepository.Get(x => x.CustomerId == existedTicket.SellerId & x.Isdefault == true);

            //StripeConfiguration.SetApiKey(SETTING.Value.SecretStripe);

            //var amount = existedTicket.SellingPrice / existedTicket.CommissionPercent * 100;
            //var options = new PayoutCreateOptions
            //{
            //    Amount = Convert.ToInt64(amount) * 100,
            //    Currency = "usd",
            //    Destination = creditCard.CardId,
            //};
            //var service = new Stripe.PayoutService();
            //var payout = service.Create(options);

            //Core.Models.Payout payoutCreateIntoDatabase = new Core.Models.Payout();
            //payoutCreateIntoDatabase.StripePayoutId = payout.Id;
            ////payoutCreateIntoDatabase.CreditCardId = creditCard.Id;
            //payoutCreateIntoDatabase.TicketId = existedTicket.Id;
            //payoutCreateIntoDatabase.Amount = payout.Amount;
            //payoutCreateIntoDatabase.FeeAmount = existedTicket.CommissionPercent;
            //payoutCreateIntoDatabase.Status = PayoutStatus.Success;
            //_payoutRepository.Add(payoutCreateIntoDatabase);
            //_unitOfWork.CommitChanges();

            return "";
        }
    }
}
