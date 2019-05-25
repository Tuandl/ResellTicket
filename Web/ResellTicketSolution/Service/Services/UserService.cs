using AutoMapper;
using Core.Models;
using Core.Repository;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;
using ViewModel.ViewModel.User;

namespace Service.Services
{
    public interface IUserService
    {
        Task<IEnumerable<IdentityError>> CreateUserAsync(UserViewModel model);
    }

    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager; //thư viện Identity của microsoft
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserService(
                UserManager<User> userManager,
                IUserRepository userRepository, 
                IMapper mapper
            )
        {
            _userManager = userManager;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<IdentityError>> CreateUserAsync(UserViewModel model)
        {
            var user = _mapper.Map<UserViewModel, User>(model);
            var result = await _userManager.CreateAsync(user, model.Password);

            return result.Errors;
        }
    }
}
