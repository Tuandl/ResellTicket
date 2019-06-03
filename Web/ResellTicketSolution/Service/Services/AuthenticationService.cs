using Core.Models;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using ViewModel.ViewModel.Authentication;
using Core.Repository;
using System.Text;
using AutoMapper;
using ViewModel.ViewModel.Customer;
using System;

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


        public AuthenticationService(UserManager<User> userManager,
                                    ICustomerRepository customerRepository,
                                    ICustomerService customerService)
        {
            _userManager = userManager;
            _customerRepository = customerRepository;
            _customerService = customerService;
            
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
            

            return customer;
        }

        public async Task<User> CheckLoginAsync(LoginViewModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if(user == null)
            {
                return null;
            }

            var isCorrectPassword = await _userManager.CheckPasswordAsync(user, model.Password);
            if(!isCorrectPassword)
            {
                return null;
            }

            return user;
        }
    }
}
