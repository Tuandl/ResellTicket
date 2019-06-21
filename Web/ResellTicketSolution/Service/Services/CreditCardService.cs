using AutoMapper;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using ViewModel.ViewModel.CreditCard;

namespace Service.Services
{
    public interface ICreditCardService
    {
        bool CreateCreditCard(CreaditCardCreateViewModel model);
        List<CreditCardRowViewModel> GetCreditCards(int Id);
        string DeleteCreditCard(int id);
    }
    public class CreditCardService : ICreditCardService
    {
        private readonly ICreditCardRepository _creditCardRepository;
        private readonly ICustomerService _customerService;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public CreditCardService(ICreditCardRepository creditCardRepository, ICustomerService customerService,
                                IMapper mapper, IUnitOfWork unitOfWork)
        {
            _creditCardRepository = creditCardRepository;
            _customerService = customerService;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }


        public bool CreateCreditCard(CreaditCardCreateViewModel model)
        {
            var creditCard = _mapper.Map<CreaditCardCreateViewModel, CreditCard>(model);
            creditCard.CardId = Guid.NewGuid().ToString();
            _creditCardRepository.Add(creditCard);
            _unitOfWork.CommitChanges();
            return true;
        }

        public List<CreditCardRowViewModel> GetCreditCards(int id)
        {
            var creditCards = _creditCardRepository.GetAllQueryable()
                            .Where(x => x.CustomerId == id && x.Deleted == false).ToList(); ;
            var creditCardRowViewModels = _mapper.Map<List<CreditCard>, List<CreditCardRowViewModel>>(creditCards);
            return creditCardRowViewModels;
        }

        public string DeleteCreditCard(int Id)
        {
            var existedCreditCard = _creditCardRepository.Get(x => x.Id == Id);
            if (existedCreditCard == null)
            {
                return "Not found Credit Card";
            } else
            {
                existedCreditCard.Deleted = true;
                _creditCardRepository.Update(existedCreditCard);
                _unitOfWork.CommitChanges();
            }


            return "";
        }
    }
}
