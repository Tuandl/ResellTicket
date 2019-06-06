using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ViewModel.ViewModel.Customer;
using Service.Services;
using System.Net;
using ViewModel.ViewModel.Authentication;

namespace WebAPI.Controllers
{
    [Route("api/customer")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;
        private readonly IOTPService _oTPService;
        public CustomerController(ICustomerService customerService, IOTPService oTPService)
        {
            _customerService = customerService;
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
    }
}