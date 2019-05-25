using Core.Models;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using ViewModel.ViewModel.Authentication;

namespace Service.Services
{
    public interface IAuthenticationService
    {
        Task<User> CheckLoginAsync(LoginViewModel model);
    }
     

    public class AuthenticationService : IAuthenticationService
    {
        private readonly UserManager<User> _userManager; //Thư viên Identity của microsoft

        public AuthenticationService(UserManager<User> userManager) 
        {
            _userManager = userManager;
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
