using AutoMapper;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ViewModel.ViewModel.Customer;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace Service.Services
{
    public interface ICustomerService
    {
        bool CreateCustomer(CustomerRegisterViewModel model);
        string HashPassword(string password);
        List<CustomerRowViewModel> GetCutomers(string param);
        CustomerRowViewModel FindCustomerById(int id);
        string UpdateCustomerAuthen(CustomerRowViewModel model);
    }
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public CustomerService(ICustomerRepository customerRepository, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _customerRepository = customerRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }
        public bool CreateCustomer(CustomerRegisterViewModel model)
        {
            var customer = _mapper.Map<CustomerRegisterViewModel, Customer>(model); //map từ ViewModel qua Model

            if (_customerRepository.Get(x => x.Username.EndsWith(model.Username)
             || x.PhoneNumber.EndsWith(model.PhoneNumber)) == null)
            {
                customer.PasswordHash = HashPassword(customer.PasswordHash);
                customer.CreatedAt = DateTime.UtcNow;
                customer.UpdatedAt = DateTime.UtcNow;
                customer.IsActive = true;
                _customerRepository.Add(customer);
                _unitOfWork.CommitChanges();

                return true;
            }
            return false;
        }

        public string HashPassword(string password)
        {
            byte[] salt = new byte[128 / 8];
            //int a = 123;
            //using (var rng = RandomNumberGenerator.Create())
            //{
            //    rng.GetBytes(salt);
            //}
            //Console.WriteLine($"Salt: {Convert.ToBase64String(salt)}");

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

        //public Task<CustomerRowViewModel> getUserByCustomerName(string userName)
        //{
        //    throw new NotImplementedException();
        //}

        //public Task<string> UpdateUser(CustomerRowViewModel model)
        //{
        //    throw new NotImplementedException();
        //}
    }
}
