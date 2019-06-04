using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using ViewModel.ViewModel.Customer;

namespace WebAPI.Admin.Controllers
{
    [Route("api/customer")]
    [ApiController]
    [Authorize(Roles = "Manager")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<CustomerRowViewModel>> GetCustomers(string param)
        {
            var customerRowViewModels = _customerService.GetCutomers(param);
            return customerRowViewModels;
        }

        [HttpGet("{id}")]
        public ActionResult<CustomerRowViewModel> FindCustomerById(int id)
        {
            var customerRowViewModel = _customerService.FindCustomerById(id);
            return customerRowViewModel;
        }

        [HttpPut]
        public ActionResult UpdateCustomer(CustomerRowViewModel model)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest("Invalid Request");
            //}

            var updateResult = _customerService.UpdateCustomerAuthen(model);

            if (!string.IsNullOrEmpty(updateResult))
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, updateResult);
            }
            return Ok();
        }



    }
}