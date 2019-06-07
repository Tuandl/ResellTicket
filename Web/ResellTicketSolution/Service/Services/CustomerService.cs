﻿using AutoMapper;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using ViewModel.ViewModel.Customer;

namespace Service.Services
{
    public interface ICustomerService
    {
        bool CreateCustomer(CustomerRegisterViewModel model);
        string HashPassword(string password, byte[] salt);
        List<CustomerRowViewModel> GetCutomers(string param);
        CustomerRowViewModel FindCustomerById(int id);
        string UpdateCustomerAuthen(CustomerRowViewModel model);
        bool CheckIsExistedPhoneNumber(string phoneNumber);

        /// <summary>
        /// Send OTP for customer when customer forgot password
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        string SendOTPForgotPassword(CustomerForgotPasswordViewModel model);

        /// <summary>
        /// Use when customer received OTP when forgot password
        /// </summary>
        /// <param name="customerChangePasswordWithOTPConfirm"></param>
        /// <returns></returns>
        string ChangePasswordWithOTPConfirm(CustomerChangePasswordWithOTPConfirm customerChangePasswordWithOTPConfirm);
    }

    public class CustomerService : ICustomerService
    {
        public const string ERROR_NOT_FOUND_CUSTOMER = "Not found customer.";
        public const string ERROR_INVALID_OTP = "Invalid OTP.";

        private readonly ICustomerRepository _customerRepository;
        private readonly IOTPRepository _oTPRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        private readonly IOTPService _oTPService;


        public CustomerService(ICustomerRepository customerRepository, 
            IOTPRepository oTPRepository, 
            IMapper mapper, 
            IUnitOfWork unitOfWork,
            IOTPService oTPService)
        {
            _customerRepository = customerRepository;
            _oTPRepository = oTPRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _oTPService = oTPService;
        }

        public bool CreateCustomer(CustomerRegisterViewModel model)
        {
            var customer = _mapper.Map<CustomerRegisterViewModel, Customer>(model); //map từ ViewModel qua Model

            if ((_customerRepository.Get(x => x.Username.Equals(model.Username, StringComparison.Ordinal)) == null) &&
                    _oTPRepository.Get(x => x.PhoneNo.Equals(model.PhoneNumber) && 
                    x.Code.Equals(model.OTPNumber) && x.ExpiredAt > DateTime.UtcNow) != null )
            {
                byte[] salt = new byte[128 / 8];
                using (var rng = RandomNumberGenerator.Create())
                {
                    rng.GetBytes(salt);
                }
                //Console.WriteLine($"Salt: {Convert.ToBase64String(salt)}");
                customer.PasswordHash = HashPassword(customer.PasswordHash, salt);
                customer.SaltPasswordHash = Convert.ToBase64String(salt);
                customer.CreatedAt = DateTime.UtcNow;
                customer.UpdatedAt = DateTime.UtcNow;
                customer.IsActive = true;
                _customerRepository.Add(customer);
                _unitOfWork.CommitChanges();

                return true;
            }
            return false;
        }

        public string HashPassword(string password, byte[] salt)
        {
            
            // derive a 256-bit subkey (use HMACSHA1 with 10,000 iterations)
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));
            return hashed;
        }

        //string orderBy, string param
        public List<CustomerRowViewModel> GetCutomers(string param)
        {
            param = param ?? "";
            var customers = _customerRepository.GetAllQueryable()
                            .Where(x => x.Username.Contains(param)
                            || x.FullName.ToLower().Contains(param.ToLower())
                            || x.Email.ToLower().Contains(param.ToLower())
                            || x.PhoneNumber.Contains(param)).ToList();
            var customerRowViewModels = _mapper.Map<List<Customer>, List<CustomerRowViewModel>>(customers);
            return customerRowViewModels;
        }

        public CustomerRowViewModel FindCustomerById(int id)
        {
            var customer = _customerRepository.Get(x => x.Id == id);
            var customerRowViewModel = _mapper.Map<Customer, CustomerRowViewModel>(customer);
            return customerRowViewModel;
        }

        public string UpdateCustomerAuthen(CustomerRowViewModel model)
        {
            var existedCustomer = _customerRepository.Get(x => x.Id == model.Id);
            if (existedCustomer == null)
            {
                return "Not found customer";
            }

            existedCustomer.IsActive = model.IsActive;
            _customerRepository.Update(existedCustomer);
            try
            {
                _unitOfWork.CommitChanges();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

            return string.Empty;
        }

        public bool CheckIsExistedPhoneNumber(string phoneNumber)
        {
            if(_customerRepository.Get(x => x.PhoneNumber.Equals(phoneNumber)) == null)
            {
                return true;
            }

            return false;
        }

        public string SendOTPForgotPassword(CustomerForgotPasswordViewModel model)
        {
            var existedCustomer = _customerRepository.Get(x => 
                x.Deleted == false &&
                x.PhoneNumber == model.PhoneNumber
            );

            if(existedCustomer == null)
            {
                return ERROR_NOT_FOUND_CUSTOMER;
            }
            _oTPService.CreatOTPWithEachPhone(model.PhoneNumber);
            
            return string.Empty;
        }

        public string ChangePasswordWithOTPConfirm(CustomerChangePasswordWithOTPConfirm model)
        {
            var validOtp = _oTPRepository.Get(x => 
                x.Deleted == false &&
                x.Code == model.OTP &&
                x.ExpiredAt > DateTime.Now && 
                x.PhoneNo == model.PhoneNumber
            );

            if(validOtp == null)
            {
                return ERROR_INVALID_OTP;
            }

            //Find existed customer -> update this customer
            var existedCustomer = _customerRepository.Get(x =>
                x.Deleted == false &&
                x.PhoneNumber == model.PhoneNumber
            );

            if(existedCustomer == null)
            {
                return ERROR_NOT_FOUND_CUSTOMER;
            }

            //Generate new password hash
            byte[] salt = new byte[128 / 8];
            using (var randomNumberGenerator = RandomNumberGenerator.Create())
            {
                randomNumberGenerator.GetBytes(salt);
            }
            existedCustomer.PasswordHash = HashPassword(model.Password, salt);
            existedCustomer.SaltPasswordHash = Convert.ToBase64String(salt);
            _customerRepository.Update(existedCustomer);
            _unitOfWork.CommitChanges();

            return string.Empty;
        }
    }
}
