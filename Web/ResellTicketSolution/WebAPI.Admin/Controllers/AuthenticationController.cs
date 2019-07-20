using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Service.Services;
using System.Net;
using System.Threading.Tasks;
using Core.Models;
using Core.Repository;
using ViewModel.AppSetting;
using ViewModel.ViewModel.Authentication;
using WebAPI.Admin.Configuration.Authorization;
using Microsoft.AspNetCore.Identity;

namespace WebAPI.Admin.Controllers
{
    [AllowAnonymous]
    [Route("api/token")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        //AuthSetting from appSettings.json
        private readonly IOptions<AuthSetting> AUTH_SETTING;
        private readonly IAuthenticationService _authenticationService;
        private readonly UserManager<User> _userManager;
        private readonly IAdminDeviceService _adminDeviceService;

        public AuthenticationController(
            IOptions<AuthSetting> options,
            IAuthenticationService authenticationService,
            UserManager<User> userManager,
            IAdminDeviceService adminDeviceService
        )
        {
            AUTH_SETTING = options;
            _authenticationService = authenticationService;
            _userManager = userManager;
            _adminDeviceService = adminDeviceService;
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
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }
            
            //Call Service asynchronous to check login
            var user = await _authenticationService.CheckLoginAsync(model);

            if (user == null || !user.IsActive)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, "Invalid Username or password");
            }
            _adminDeviceService.AddAdminDevice(user.Id, model.DeviceId);
            var roles = _userManager.GetRolesAsync(user);
            //Get Value from appSetting.json
            var token = user.BuildToken(AUTH_SETTING.Value, roles.Result); 
            return Ok(token);
        }

        
    }
}