using AutoMapper;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ViewModel.ViewModel.Customer;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace Service.Services
{
    public interface ICustomerService
    {
        bool CreateCustomer(CustomerRegisterViewModel model);
        string HashPassword(string password, byte[] salt);


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

            if(_customerRepository.Get(x => x.Username.EndsWith(model.Username)
            || x.PhoneNumber.EndsWith(model.PhoneNumber)) == null)
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

        public Task<CustomerRowViewModel> FindCustomerById(string userId)
        {
            throw new NotImplementedException();
        }

        public List<CustomerRowViewModel> GetCutomers(string orderBy, string param)
        {
            throw new NotImplementedException();
        }

        public Task<CustomerRowViewModel> getUserByCustomerName(string userName)
        {
            throw new NotImplementedException();
        }

        public Task<string> UpdateUser(CustomerUpdateViewModel model)
        {
            throw new NotImplementedException();
        }
    }
}
