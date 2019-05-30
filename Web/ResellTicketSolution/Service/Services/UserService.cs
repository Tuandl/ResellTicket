using AutoMapper;
using Core.Models;
using Core.Repository;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ViewModel.ViewModel.User;

namespace Service.Services
{
    public interface IUserService
    {
        Task<IEnumerable<IdentityError>> CreateUserAsync(UserRegisterViewModel model);
        List<UserRowViewModel> GetUsers(string orderBy, string param);
        Task<UserRowViewModel> getUserByUserName(string userName);

        Task<UserRowViewModel> FindUserById(string userId);

        //List<UserRowViewModel> GetUsersByFullNameOrUserName(string param);
    }

    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager; //thư viện Identity của microsoft
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserService(
                UserManager<User> userManager, //inject userManager, thư viện của Microsoft
                IUserRepository userRepository, //inject userRepository
                IMapper mapper                  // inject mapper để map giữa ViewModel và Model
            )
        {
            _userManager = userManager;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        //Hàm tạo user dùng thư viện userManager
        public async Task<IEnumerable<IdentityError>> CreateUserAsync(UserRegisterViewModel model)
        {
            var user = _mapper.Map<UserRegisterViewModel, User>(model); //map từ ViewModel qua Model
            var result = await _userManager.CreateAsync(user, model.Password);
            
            return result.Errors;
        }

        public async Task<UserRowViewModel> getUserByUserName(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            var userRowViewModel = _mapper.Map<User, UserRowViewModel>(user);
            return userRowViewModel;
        }

        public async Task<UserRowViewModel> FindUserById(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            var userRowViewModel = _mapper.Map<User, UserRowViewModel>(user);
            return userRowViewModel;
        }

        public List<UserRowViewModel> GetUsers(string orderBy, string param)
        {
            var users = new List<User>();
            orderBy = orderBy ?? "";        //orderBy = null gán bằng ""
            param = param ?? "";            //param = null gán bằng ""
            if (orderBy == "desc")
            {
                //Lấy user có FullName like param hoặc UserName like param và sắp xếp decs theo UserName
                users = _userRepository
                    .GetAllQueryable()
                    .Where(u => u.FullName.ToLower().Contains(param.ToLower()) || u.UserName.ToLower().Contains(param.ToLower()))
                    .OrderByDescending(u => u.UserName).ToList();
            }
            else //Lấy user có FullName like param hoặc UserName like param và sắp xếp asc theo UserName
            {
                users = _userRepository.GetAllQueryable()
                    .Where(u => u.FullName.ToLower().Contains(param.ToLower()) || u.UserName.ToLower().Contains(param.ToLower()))
                    .OrderBy(u => u.UserName).ToList();
            }
            //Map từ Model qua ViewModel
            var userRowViewModels = _mapper.Map<List<User>, List<UserRowViewModel>>(users);
            return userRowViewModels;
        }

        //public List<UserRowViewModel> GetUsersByFullNameOrUserName(string param) //get users by 
        //{
        //    var users = _userRepository.GetAllQueryable() 
        //                .Where(u => u.FullName.Contains(param) || u.UserName.Contains(param)).ToList();
        //    var userRowViewModels = _mapper.Map<List<User>, List<UserRowViewModel>>(users);
            
        //    return userRowViewModels;
        //}
    }
}
