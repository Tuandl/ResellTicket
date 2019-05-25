using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Service.Services;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using ViewModel.AppSetting;
using ViewModel.ViewModel.Authentication;
using ViewModel.ViewModel.User;
using WebAPI.Admin.Configuration.Authorization;

namespace WebAPI.Admin.Controllers
{
    [AllowAnonymous]
    [Route("api/token")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IOptions<AuthSetting> AUTH_SETTING; //?
        private readonly IAuthenticationService _authenticationService;
        private readonly IUserService _userService;

        public AuthenticationController(
            IOptions<AuthSetting> options,
            IAuthenticationService authenticationService,
            IUserService userService
            )
        {
            AUTH_SETTING = options;
            _authenticationService = authenticationService;
            _userService = userService;
        }

        /// <summary>
        /// Check login for User Admin
        /// </summary>
        /// <param name="model"></param>
        /// <returns>Return Token for Admin</returns>
        /// <response code="200">Return Access Token</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="406">Invaild Username Or Password</response>
        [HttpPost]
        [Route("checkLogin")]
        public async Task<IActionResult> CheckLogin(LoginViewModel model) //object truyền từ client tự động map với object tham số 
        {
            if(!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }
            
            var user = await _authenticationService.CheckLoginAsync(model);

            if(user == null)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, "Invalid Username or password");
            }

            //AUTH_SETTING.Value: tự sinh value?
            var token = user.BuildToken(AUTH_SETTING.Value); 
            return Ok(token);
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
        [Route("register")]
        public async Task<IActionResult> Register(UserViewModel model)  //object truyền từ client tự động map với object tham số 
        {
            if (!ModelState.IsValid) 
            {
                return BadRequest("Invalid Request");
            }

            //await: đợi xử lý xong CreateUserAsync(model) function mới chạy tiếp dòng 82
            var errors = await _userService.CreateUserAsync(model); 
            if(errors.Any())
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, errors);
            }

            return Ok();
        }
    }
}