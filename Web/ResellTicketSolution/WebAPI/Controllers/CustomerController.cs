﻿using Microsoft.AspNetCore.Mvc;
using Service.EmailService;
using Service.Services;
using System.Collections.Generic;
using System.Net;
using ViewModel.ViewModel.Customer;
using ViewModel.ViewModel.Transaction;
using ViewModel.ViewModel.Route;
using Microsoft.AspNetCore.Authorization;
using System;

namespace WebAPI.Controllers
{
    [Route("api/customer")]
    [ApiController]
    [Authorize]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;
        private readonly ISendGridService _sendGridService;
        private readonly IOTPService _oTPService;
        public CustomerController(ICustomerService customerService, ISendGridService sendGridService, IOTPService oTPService)
        {
            _customerService = customerService;
            _sendGridService = sendGridService;
            _oTPService = oTPService;
        }
        [HttpPost]
        [AllowAnonymous]
        [Route("")]
        public IActionResult Register(CustomerRegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }

            var customer = _customerService.CreateCustomer(model);

            if(customer == false)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, customer);
            }

            return Ok();
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("checkPhone")]
        public IActionResult CheckPhoneNumber(CustomerCheckPhoneNumberViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }

            var customer = _customerService.CheckIsExistedPhoneNumber(model.PhoneNumber);

            if (customer == false)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, "Phone number already exists");
            }

            var phoneNumberToView = _oTPService.CreatOTPWithEachPhone(model.PhoneNumber);

            return Ok(phoneNumberToView);
        }

        /// <summary>
        /// Forgot password. Send OTP confirm reset password
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        /// <response code="200">Send OTP success (Dev OTP = "123456")</response>
        /// <response code="406">Not found customer with model Phone Number</response>
        [HttpPost]
        [AllowAnonymous]
        [Route("forget-password")]
        public IActionResult SendOTPWhenForgotPassword(CustomerForgotPasswordViewModel model)
        {
            var sendOTPResult = _customerService.SendOTPForgotPassword(model);

            if(sendOTPResult == CustomerService.ERROR_NOT_FOUND_CUSTOMER)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, sendOTPResult);
            }

            return Ok();
        }

        /// <summary>
        /// Reset password with OTP confirmation
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        /// <response code="200">Success</response>
        /// <response code="400">Invalid OTP</response>
        /// <response code="406">Not found Customer</response>
        [HttpPost]
        [AllowAnonymous]
        [Route("reset-password")]
        public IActionResult ResetPassword(CustomerChangePasswordWithOTPConfirm model)
        {
            var resetPasswordResult = _customerService.ChangePasswordWithOTPConfirm(model);

            if(resetPasswordResult == CustomerService.ERROR_INVALID_OTP)
            {
                return BadRequest(resetPasswordResult);
            }

            if(resetPasswordResult == CustomerService.ERROR_NOT_FOUND_CUSTOMER)
            {
                return StatusCode((int) HttpStatusCode.NotAcceptable, resetPasswordResult);
            }

            return Ok();
        }

        [HttpPut]
        [Route("change-password")]
        public IActionResult ResetPasswordWithNoOTPnumber(CustomerChangePasswordViewModel model)
        {
            var resetPasswordResult = _customerService.ChangePasswordWithNoOTPConfirm(model);

            if (resetPasswordResult == CustomerService.ERROR_INVALID_PASSWORD)
            {
                return BadRequest(resetPasswordResult);
            }

            if (resetPasswordResult == CustomerService.ERROR_NOT_FOUND_CUSTOMER)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, resetPasswordResult);
            }

            return Ok();
        }

        [HttpPut]
        public ActionResult UpdateProfileCustomer(CustomerRowViewModel model)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest("Invalid Request");
            //}

            var updateResult = _customerService.UpdateCustomerPofile(model);

            if (!string.IsNullOrEmpty(updateResult))
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, updateResult);
            }
            return Ok();
        }
        [HttpGet]
        [Route("getCustomerByUsename")]
        public ActionResult<CustomerRowViewModel> FindCustomerByUsename(string usename)
        {
            var customerRowViewModel = _customerService.FindCustomerByUsername(usename);
            return customerRowViewModel;
        }

        [HttpGet]
        [Route("get-id-customer-by-username")]
        public ActionResult<int> FindCustomerIdByUsename(string usename)
        {
            var customerRowViewModel = _customerService.FindCustomerByUsername(usename);
            return customerRowViewModel.Id;
        }


        [HttpPut]
        [Route("add-bank-connect-account")]
        public IActionResult AddBankAccount(string code)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }

            var username = User.Identity.Name;
            var updateResult = _customerService.AddAccountStripeToReceiveMoney(username, code);

            if (!string.IsNullOrEmpty(updateResult))
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, updateResult);
            }
            return Ok();

        }

        [HttpGet]
        [Route("check-existed-connect-bank-account")]
        public ActionResult CheckIsExistedConnectAccount()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }
            try
            {
                var username = User.Identity.Name;
                var customer = _customerService.CheckIsExistedConnectBankAccount(username);

                if (customer == false)
                {
                    return StatusCode((int)HttpStatusCode.NotAcceptable, "This customer already have a connect account!!");
                }

                return Ok("");
            }
            catch(Exception e)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, e.Message);
            }
        }

        [HttpGet]
        [Route("view-connect-account")]
        public IActionResult ViewBankAccountConnect()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }

            try
            {
                var username = User.Identity.Name;
                var customer = _customerService.ViewAccountConnect(username);

                if (customer == CustomerService.ERROR_NOT_FOUND_CUSTOMER)
                {
                    return StatusCode((int)HttpStatusCode.NotAcceptable, customer);
                }

                return Ok(customer);
            } catch(Exception e)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, e.Message);
            }
           
        }

        [HttpGet]
        [Route("detail")]
        public ActionResult<CustomerRowViewModel> GetCustomerDetail()
        {
            try
            {
                var username = User.Identity.Name;
                var customer = _customerService.GetCustomerDetail(username);
                return Ok(customer);
            } catch(Exception e)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, e.Message);
            }
            
        }

        //[HttpPost]
        //[Route("send-email-replace-for-buyer")]
        //public IActionResult SendEmailReplacementForBuyer(int oldTicketId, int replacementTicketId)
        //{
        //    _sendGridService.SendEmailReplacementForBuyer(oldTicketId, replacementTicketId);
        //    return Ok();
        //}

        [HttpGet]
        [Route("get-transaction")]
        public ActionResult<List<TransactionDataTable>> GetListTransactions(int page, int pageSize)
        {
            try
            {
                var username = User.Identity.Name;
                var listTransaction = _customerService.GetTransactions(username, page, pageSize);
                return listTransaction;
            }
            catch(Exception e)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, e.Message);
            }
        }

        [HttpPut]
        [Route("logout")]
        public ActionResult Logout(string deviceId)
        {
            try
            {
                var username = User.Identity.Name;
                _customerService.Logout(username, deviceId);
            } catch(Exception e)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, e.Message);
            }
            return Ok();
        }
    }
}