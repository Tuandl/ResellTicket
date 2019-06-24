using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Service.Services;
using System.Net;
using ViewModel.AppSetting;
using ViewModel.ViewModel.Authentication;
using WebAPI.Configuration.Authorization;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly ICustomerService _customerService;
        private readonly IOptions<AuthSetting> AUTH_SETTING;

        public AuthenticationController(
            IAuthenticationService authenticationService,
            ICustomerService customerService,
            IOptions<AuthSetting> options
            )
        {
            _authenticationService = authenticationService;
            _customerService = customerService;
            AUTH_SETTING = options;
        }

        [AllowAnonymous]
        [HttpPost]
        public ActionResult RequestToken(LoginViewModel model)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }

            //string token = string.Empty;
            //if(_authenticationService.IsAuthenticated(model, out token))
            //{
            //    return Ok(token);
            //}

            return BadRequest("Invalid Request");
        }

        [HttpPost]
        [Route("customer")]
        public IActionResult CheckCustomerLogin(LoginViewModel loginViewModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }

            //Call Service asynchronous to check login
            var customer = _authenticationService.CheckCustomerLogin(loginViewModel);

            if (customer == null)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, "Invalid Username or password");
            }

            customer.PasswordHash = null;

            //Get Value from appSetting.json
            var token = customer.BuildToken(AUTH_SETTING.Value);
            //return value to client ( username, phone, token)
            LoginReturnViewModel loginReturn = new LoginReturnViewModel();
            loginReturn.PhoneNumber = customer.PhoneNumber;
            loginReturn.Username = customer.Username;
            loginReturn.Id = customer.Id;
            loginReturn.Token = token;

            return Ok(loginReturn);
        }
    }
}