using Microsoft.AspNetCore.Mvc;
using Service.Services;
using System.Net;
using ViewModel.ViewModel.CreditCard;
using System.Collections.Generic;

namespace WebAPI.Controllers
{
    [Route("api/credit-card")]
    [ApiController]
    public class CreditCardController : ControllerBase
    {
        private readonly ICreditCardService _creditCardService;
        private readonly ICustomerService _customerService;

        public CreditCardController(ICreditCardService creditCardService, ICustomerService customerService)
        {
            _creditCardService = creditCardService;
            _customerService = customerService;
        }

        [HttpPost]
        [Route("")]
        public IActionResult CreateCreditCard(CreaditCardCreateViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }

            var creditCard = _creditCardService.CreateCreditCard(model);

            if (creditCard == false)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, creditCard);
            }

            return Ok();
        }

        [HttpPut]
        [Route("")]
        public ActionResult DeleteCreditCard(int Id)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest("Invalid Request");
            //}

            var updateResult = _creditCardService.DeleteCreditCard(Id);

            if (!string.IsNullOrEmpty(updateResult))
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, updateResult);
            }
            return Ok();
        }

        [HttpGet]
        [Route("")]
        public ActionResult<List<CreditCardRowViewModel>> GetCreditCardByCustomerId(int id)
        {
            var creditCardRowViewModel = _creditCardService.GetCreditCards(id);
            return creditCardRowViewModel;
        }

    }
}