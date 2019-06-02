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
        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
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
    }
}