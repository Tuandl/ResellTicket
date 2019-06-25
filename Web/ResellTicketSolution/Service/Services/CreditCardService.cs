using AutoMapper;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Stripe;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
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

        [Obsolete]
        public bool CreateCreditCard(CreaditCardCreateViewModel model)
        {
            StripeConfiguration.SetApiKey("sk_test_qGUMkKnqGEznTP75HVwvRKcd00wFcYnqjH");

            var options = new CustomerCreateOptions
            {
                Description = "Customer for jenny.rosen@example.com",
                SourceToken = model.CardId
            };

            var service = new Stripe.CustomerService();
            Stripe.Customer customer = service.Create(options);

            //var optionsCard = new CardCreateOptions
            //{
            //    SourceToken = "tok_visa"
            //};
            //var serviceCard = new Stripe.CardService();
            //var card = serviceCard.Create(customer.Id, optionsCard);

            model.CardId = customer.DefaultSourceId;
            model.Last4DigitsHash = encrypt(model.Last4DigitsHash);
            var creditCard = _mapper.Map<CreaditCardCreateViewModel, CreditCard>(model);
            //creditCard.CardId = Guid.NewGuid().ToString();
            _creditCardRepository.Add(creditCard);
            _unitOfWork.CommitChanges();
            return true;
        }

        public string encrypt(string encryptString)
        {
            string EncryptionKey = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
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
            string EncryptionKey = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
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
