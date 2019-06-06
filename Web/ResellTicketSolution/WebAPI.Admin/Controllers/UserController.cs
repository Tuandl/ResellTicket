using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Service.Services;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using ViewModel.AppSetting;
using ViewModel.ViewModel.User;

namespace WebAPI.Admin.Controllers
{
    [Route("api/user")]
    [ApiController]
    
    public class UserController : ControllerBase
    {
        private readonly IOptions<AuthSetting> AUTH_SETTING;
        private readonly IUserService _userService;

        public UserController(IUserService userService,
            IOptions<AuthSetting> authSetting) //inject userService 
        {
            AUTH_SETTING = authSetting;
            _userService = userService;
        }

        /// <summary>
        /// Get All Users
        /// </summary>
        /// <param name="orderBy"></param>
        /// <param name="param"></param>
        /// <returns>Return List admins</returns>
        /// <response code="200">Return List users</response>
        [HttpGet]
        [Authorize(Roles = "Manager")]
        public ActionResult<IEnumerable<UserRowViewModel>> GetUsers(string orderBy, string param) { //Lấy all admin users
            var userRowViewModels = _userService.GetUsers(orderBy, param); 
            return userRowViewModels; 
            
        }

        /// <summary>
        /// Return User Detail
        /// </summary>
        /// <param name="id">UserId</param>
        /// <returns>User Detail</returns>
        /// <response code="200">Success</response>
        /// <response code="400">Missing Parameter</response>
        /// <response code="404">Not found User</response>
        [HttpGet("{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<ActionResult<UserRowViewModel>> FindUserById(string id)
        { //Lấy all admin users
            if(string.IsNullOrEmpty(id))
            {
                return BadRequest("Invalid Request.");
            }

            var userRowViewModel = await _userService.FindUserById(id);

            if(userRowViewModel == null)
            {
                return NotFound();
            }
            return userRowViewModel;
        }

        /// <summary>
        /// Register API for User Admin
        /// </summary>
        /// <param name="model"></param>
        /// <returns>Return nothing if create success</returns>
        /// <response code="200">Success</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="406">Create Error</response>
        [HttpPost]
        [Route("")]
        [Authorize(Roles = "Manager")]
        public async Task<ActionResult> Register(UserRegisterViewModel model)  //object truyền từ client tự động map với object tham số 
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }

            string defaultPassword = "123123";
            if(!string.IsNullOrEmpty(AUTH_SETTING.Value.DefaultPassword))
            {
                defaultPassword = AUTH_SETTING.Value.DefaultPassword;
            }

            //await: đợi xử lý xong CreateUserAsync(model) function mới chạy tiếp
            var errors = await _userService.CreateUserAsync(model, defaultPassword);

            if (errors.Any())
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, errors);
            }

            return Ok();
        }

        /// <summary>
        /// Update UserAdmin
        /// </summary>
        /// <param name="model"></param>
        /// <returns>Return nothing if update success</returns>
        /// <response code="200">Success</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="406">Update Error</response>
        [HttpPut]
        [Route("")]
        [Authorize(Roles = "Manager")]
        public async Task<ActionResult> UpdateUser(UserUpdateViewModel model)  
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }

            var updateResult = await _userService.UpdateUser(model);

            if (!string.IsNullOrEmpty(updateResult))
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, updateResult);
            }

            return Ok();
        }

        [HttpPut("profile")]
        [Authorize]
        public async Task<ActionResult> UpdateUserProfile(UserProfileViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }

            var updateResult = await _userService.UpdateUserProfile(model);
            if (!string.IsNullOrEmpty(updateResult))
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, updateResult);
            }
            return Ok();
        }

        [HttpPut("password")]
        [Authorize]
        public async Task<ActionResult> ChangePassword(UserPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }

            var result = await _userService.ChangePassword(model);
            if (!string.IsNullOrEmpty(result))
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, result);
            }
            return Ok();
        }
    }
}