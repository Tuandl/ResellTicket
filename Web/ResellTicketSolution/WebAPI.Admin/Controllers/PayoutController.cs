using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Services;

namespace WebAPI.Admin.Controllers
{
    [Route("api/payout")]
    [ApiController]
    [Authorize(Roles = "Staff")]
    public class PayoutController : Controller
    {
        private readonly IPayoutService _payoutService;

        public PayoutController(IPayoutService payoutService)
        {
            _payoutService = payoutService;
        }

        [HttpPost]
        public IActionResult MakePayout(int ticketId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }
            //var username = User.Identity.Name;
            var payout = _payoutService.MakePayoutToCustomer(ticketId);

            if (payout == "Not found route ticket")
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, payout);
            }

            return Ok();
        }

    }
}