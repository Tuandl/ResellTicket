using AutoMapper;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.Extensions.Options;
using Stripe;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using ViewModel.AppSetting;
using ViewModel.ViewModel.CreditCard;
using ViewModel.ViewModel.Customer;

namespace Service.Services
{
    public interface ICreditCardService
    {
        bool CreateCreditCard(CreaditCardCreateViewModel model);
        List<CreditCardRowViewModel> GetCreditCards(int Id);
        CreditCardMakeChargeMoneyViewModel GetCardToPayment(int CustomerId);
        string SetDefaultCard(int id, int customerId);
        string DeleteCreditCard(int id);
    }
    public class CreditCardService : ICreditCardService
    {
        private readonly ICreditCardRepository _creditCardRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly ICustomerService _customerService;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOptions<CrediCardSetting> SETTING;

        public CreditCardService(ICreditCardRepository creditCardRepository, ICustomerService customerService, ICustomerRepository customerRepository,
                                IMapper mapper, IUnitOfWork unitOfWork, IOptions<CrediCardSetting> options)
        {
            _creditCardRepository = creditCardRepository;
            _customerService = customerService;
            _customerRepository = customerRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            SETTING = options;
        }

        [Obsolete]
        public bool CreateCreditCard(CreaditCardCreateViewModel model)
        {
            StripeConfiguration.SetApiKey(SETTING.Value.SecretStripe);


            var customerTMP = _customerRepository.Get(x => x.Id == model.CustomerId);

            if (customerTMP.StripeId == null || customerTMP.StripeId == "")
            {
                var options = new CustomerCreateOptions
                {
                    Email = customerTMP.Email,
                    Description = "Customer for " + customerTMP.FullName + " " + customerTMP.Email,
                    SourceToken = model.CardId
                };
                var service = new Stripe.CustomerService();
                Stripe.Customer customer = service.Create(options);
                customerTMP.StripeId = customer.Id;
                _customerRepository.Update(customerTMP);
                model.CardId = customer.DefaultSourceId;
                model.Isdefault = true;
            }
            else
            {
                var optionsCard = new CardCreateOptions
                {
                    SourceToken = model.CardId
                };
                var serviceCard = new Stripe.CardService();
                var card = serviceCard.Create(customerTMP.StripeId, optionsCard);
                model.CardId = card.Id;
            }
            model.Last4DigitsHash = encrypt(model.Last4DigitsHash);
            var creditCard = _mapper.Map<CreaditCardCreateViewModel, CreditCard>(model);
            _creditCardRepository.Add(creditCard);
            _unitOfWork.CommitChanges();
            return true;
        }

        public string encrypt(string encryptString)
        {
            string EncryptionKey = SETTING.Value.Secret;
            byte[] clearBytes = Encoding.Unicode.GetBytes(encryptString);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] {
            0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76
        });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(clearBytes, 0, clearBytes.Length);
                        cs.Close();
                    }
                    encryptString = Convert.ToBase64String(ms.ToArray());
                }
            }
            return encryptString;
        }
        public string Decrypt(string cipherText)
        {
            string EncryptionKey = SETTING.Value.Secret;
            cipherText = cipherText.Replace(" ", "+");
            byte[] cipherBytes = Convert.FromBase64String(cipherText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] {
            0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76
        });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(cipherBytes, 0, cipherBytes.Length);
                        cs.Close();
                    }
                    cipherText = Encoding.Unicode.GetString(ms.ToArray());
                }
            }
            return cipherText;
        }

        public List<CreditCardRowViewModel> GetCreditCards(int id)
        {
            var creditCards = _creditCardRepository.GetAllQueryable()
                            .Where(x => x.CustomerId == id && x.Deleted == false).ToList();
            creditCards.ForEach(credit => credit.Last4DigitsHash = Decrypt(credit.Last4DigitsHash));
            var creditCardRowViewModels = _mapper.Map<List<CreditCard>, List<CreditCardRowViewModel>>(creditCards);
            return creditCardRowViewModels;
        }

        public string DeleteCreditCard(int Id)
        {
            var existedCreditCard = _creditCardRepository.Get(x => x.Id == Id);
            if (existedCreditCard == null)
            {
                return "Not found Credit Card";
            }
            else
            {
                existedCreditCard.Deleted = true;
                _creditCardRepository.Update(existedCreditCard);
                _unitOfWork.CommitChanges();
            }


            return "";
        }

        public string SetDefaultCard(int id, int customerId)
        {
            var creditCardToSetDefault = _creditCardRepository.Get(x => x.Id == id & x.CustomerId == customerId);
            var creditCardToSetNOTDefault = _creditCardRepository.Get(x => x.CustomerId == customerId && x.Isdefault == true);
            if (creditCardToSetDefault == null)
            {
                return "Not found Credit Card";
            }
            else
            {
                creditCardToSetNOTDefault.Isdefault = false;
                creditCardToSetDefault.Isdefault = true;
                _creditCardRepository.Update(creditCardToSetNOTDefault);
                _creditCardRepository.Update(creditCardToSetDefault);
                _unitOfWork.CommitChanges();
            }
            return "";
        }

        public CreditCardMakeChargeMoneyViewModel GetCardToPayment(int CustomerId)
        {
            var creditCardToMakePayment = _creditCardRepository.Get(x => x.CustomerId == CustomerId && x.Isdefault == true);
            var creditCardMakeChargeMoneyViewModel = _mapper.Map<CreditCard, CreditCardMakeChargeMoneyViewModel>(creditCardToMakePayment);
            return creditCardMakeChargeMoneyViewModel;
        }
    }
}
