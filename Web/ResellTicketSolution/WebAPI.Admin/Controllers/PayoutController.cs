using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.EmailService;
using Service.Services;

namespace WebAPI.Admin.Controllers
{
    [Route("api/payout")]
    [ApiController]
    [Authorize(Roles = "Staff")]
    public class PayoutController : Controller
    {
        private readonly IPayoutService _payoutService;
        private readonly ISendGridService _sendGridService;


        public PayoutController(IPayoutService payoutService, ISendGridService sendGridService)
        {
            _payoutService = payoutService;
            _sendGridService = sendGridService;
        }

        [HttpPost]
        public IActionResult MakePayout(int ticketId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }
            string username = User.Identity.Name;
            //string username = "staff";
            var payout = _payoutService.MakePayoutToCustomer(ticketId, username);

            if (!string.IsNullOrEmpty(payout))
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, payout);
            }
            //_sendGridService.SendEmailReceiptForSeller(ticketId);
            return Ok();
        }

    }
}