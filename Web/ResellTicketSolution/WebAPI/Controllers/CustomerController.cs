using Microsoft.AspNetCore.Mvc;
using Service.EmailService;
using Service.Services;
using System.Net;
using ViewModel.ViewModel.Customer;
using ViewModel.ViewModel.Route;

namespace WebAPI.Controllers
{
    [Route("api/customer")]
    [ApiController]
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
        public IActionResult CheckIsExistedConnectAccount()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }
            var username = User.Identity.Name;
            var customer = _customerService.CheckIsExistedConnectBankAccount(username);

            if (customer == false)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, "This customer already have a connect account!!");
            }

            return Ok("");
        }

        [HttpGet]
        [Route("view-connect-account")]
        public IActionResult ViewBankAccountConnect()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }
            var username = User.Identity.Name;
            var customer = _customerService.ViewAccountConnect(username);

            if (customer == CustomerService.ERROR_NOT_FOUND_CUSTOMER)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, customer);
            }

            return Ok(customer);
        }

        [HttpGet]
        [Route("detail")]
        public ActionResult<CustomerRowViewModel> GetCustomerDetail()
        {
            var username = User.Identity.Name;
            var customer = _customerService.GetCustomerDetail(username);
            return Ok(customer);
        }

        //[HttpPost]
        //[Route("send-email-receipt-for-buyer")]
        //public IActionResult SendEmailReceiptForBuyer(RouteDetailViewModel model)
        //{
        //    //if (!ModelState.IsValid)
        //    //{
        //    //    return BadRequest("Invalid Request");
        //    //}

        //    //var username = User.Identity.Name;
        //    _sendGridService.SendEmailReceiptForBuyer(model);

        //    //if (!string.IsNullOrEmpty(sendResult))
        //    //{
        //    //    return StatusCode((int)HttpStatusCode.NotAcceptable, sendResult);
        //    //}
        //    return Ok();
        //}

    }
}