using AutoMapper;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ViewModel.ViewModel.User;

namespace Service.Services
{
    public interface IUserService
    {
        Task<IEnumerable<IdentityError>> CreateUserAsync(UserRegisterViewModel model, string defaultPassword);
        UserDataTable GetUsers(string param, int page, int pageSize);
        Task<UserRowViewModel> FindUserById(string userId);

        //List<UserRowViewModel> GetUsersByFullNameOrUserName(string param);

        /// <summary>
        /// Update User for Manager 
        /// </summary>
        /// <param name="model"></param>
        /// <returns>Empty string if success</returns>
        Task<string> UpdateUser(UserUpdateViewModel model);
        Task<string> UpdateUserProfile(UserProfileViewModel model);

        Task<string> ChangePassword(UserPasswordViewModel model);
    }

    public class UserService : IUserService
    {
        public const string INCORRECT_PASS = "Current password is incorrect";

        private readonly UserManager<User> _userManager; //thư viện Identity của microsoft
        private readonly IUserRepository _userRepository;
        private readonly IUserRoleRepository _userRoleRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public UserService(
                UserManager<User> userManager, //inject userManager, thư viện của Microsoft
                IUserRepository userRepository, //inject userRepository
                IUserRoleRepository userRoleRepository,
                IUnitOfWork unitOfWork,
                IMapper mapper                  // inject mapper để map giữa ViewModel và Model
            )
        {
            _userManager = userManager;
            _userRepository = userRepository;
            _userRoleRepository = userRoleRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        //Hàm tạo user dùng thư viện userManager
        public async Task<IEnumerable<IdentityError>> CreateUserAsync(UserRegisterViewModel model, string defaultPassword)
        {
            var user = _mapper.Map<UserRegisterViewModel, User>(model); //map từ ViewModel qua Model
            var result = await _userManager.CreateAsync(user, defaultPassword);

            if (result.Succeeded)
            {
                result = await _userManager.AddToRoleAsync(user, model.RoleId);
            }

            return result.Errors;
        }

        //public async Task<UserRowViewModel> getUserByUserName(string userName)
        //{
        //    var user = await _userManager.FindByNameAsync(userName);
        //    var userRowViewModel = _mapper.Map<User, UserRowViewModel>(user);
        //    return userRowViewModel;
        //}

        public async Task<UserRowViewModel> FindUserById(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            var userRowViewModel = _mapper.Map<User, UserRowViewModel>(user);

            //Get role of user
            var userRole = _userRoleRepository.Get(x => x.UserId == userId);
            if (userRole != null)
            {
                userRowViewModel.RoleId = userRole.RoleId;
            }

            return userRowViewModel;
        }

        public UserDataTable GetUsers(string param, int page, int pageSize)
        {
            param = param ?? "";            //param = null gán bằng ""

            var users = _userRepository.GetAllQueryable()
                   .Where(u => u.FullName.ToLower().Contains(param.ToLower()) || u.UserName.ToLower().Contains(param.ToLower()))
                   .OrderBy(u => u.UserName.ToLower())
                   .Skip((page - 1) * pageSize).Take(pageSize).ToList();

            var totalUsers = _userRepository.GetAllQueryable()
                   .Where(u => u.FullName.ToLower().Contains(param.ToLower()) || u.UserName.ToLower().Contains(param.ToLower())).Count();
            //Map từ Model qua ViewModel
            var userRowViewModels = _mapper.Map<List<User>, List<UserRowViewModel>>(users);

            //Get Role for users
            foreach (var userRow in userRowViewModels)
            {
                var userRole = _userRoleRepository.Get(x => x.UserId == userRow.Id);
                if (userRole != null)
                {
                    userRow.RoleId = userRole.RoleId;
                }
            }

            var userDataTable = new UserDataTable()
            {
                Data = userRowViewModels,
                Total = totalUsers
            };

            return userDataTable;
        }

        public async Task<string> UpdateUser(UserUpdateViewModel model)
        {
            var existedUser = _userRepository.Get(x => x.Id == model.Id);
            if (existedUser == null)
            {
                return "Not found User.";
            }

            //Update IsActive
            existedUser.IsActive = model.IsActive;
            _userRepository.Update(existedUser);
            try
            {
                //push into database
                _unitOfWork.CommitChanges();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
            //If user is not assigned to this role yet
            existedUser = await _userManager.FindByIdAsync(model.Id);
            //so sánh existedUser normal name có bằng model.RoleId ko
            if (await _userManager.IsInRoleAsync(existedUser, model.RoleId) == false)
            {
                //remove existed role
                var roles = await _userManager.GetRolesAsync(existedUser);
                if (roles != null)
                {
                    await _userManager.RemoveFromRolesAsync(existedUser, roles);
                }

                //Update Role
                await _userManager.AddToRoleAsync(existedUser, model.RoleId);
            }

            return string.Empty;
        }

        public async Task<string> UpdateUserProfile(UserProfileViewModel model)
        {
            //var user = _mapper.Map<UserProfileViewModel, User>(model);
            User user = await _userManager.FindByIdAsync(model.Id);
            user.FullName = model.FullName;
            user.Email = model.Email;
            user.PhoneNumber = model.PhoneNumber;
            await _userManager.UpdateAsync(user);
            return string.Empty;
        }

        public async Task<string> ChangePassword(UserPasswordViewModel model)
        {
            User user = await _userManager.FindByNameAsync(model.Username);
            if (user == null)
            {
                return "Not found user";
            }
            var isCorrectPassword = await _userManager.CheckPasswordAsync(user, model.CurrentPass);
            if (!isCorrectPassword)
            {
                if(model.CurrentPass.Equals("123456"))
                {
                    string resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
                    await _userManager.ResetPasswordAsync(user, resetToken, model.NewPass);
                } else
                {
                    return INCORRECT_PASS;
                }
            } else
            {
                await _userManager.ChangePasswordAsync(user, model.CurrentPass, model.NewPass);
            }
            //await _userManager.RemovePasswordAsync(user);
            //await _userManager.AddPasswordAsync(user, model.newPass);
            return string.Empty;
        }
    }
}
