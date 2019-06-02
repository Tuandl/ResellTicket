using Core.Models;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using ViewModel.ViewModel.Authentication;
using Core.Repository;
using AutoMapper;
using ViewModel.ViewModel.Customer;

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
        
        public AuthenticationService(UserManager<User> userManager, ICustomerRepository customerRepository)
        {
            _userManager = userManager;
            _customerRepository = customerRepository;
            
        }

        public Customer CheckCustomerLogin(LoginViewModel loginViewModel)
        {
            var customer =  _customerRepository.Get(x => (x.Username.EndsWith(loginViewModel.Username) ||
                                                x.PhoneNumber.EndsWith(loginViewModel.Username)) && 
                                                x.PasswordHash.EndsWith(loginViewModel.Password));
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
