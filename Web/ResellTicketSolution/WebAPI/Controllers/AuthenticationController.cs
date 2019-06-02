﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using System.Net;
using ViewModel.ViewModel.Authentication;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly ICustomerService _customerService;

        public AuthenticationController(
            IAuthenticationService authenticationService,
            ICustomerService customerService
            )
        {
            _authenticationService = authenticationService;
            _customerService = customerService;
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
            loginViewModel.Password = _customerService.HashPassword(loginViewModel.Password);
            var customer = _authenticationService.CheckCustomerLogin(loginViewModel);

            if (customer == null)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, "Invalid Username or password");
            }

            customer.PasswordHash = null;

            //Get Value from appSetting.json
            return Ok(customer);
        }
    }
}