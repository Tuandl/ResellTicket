using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Services;

namespace WebAPI.Admin.Controllers
{
    [Route("api/refund")]
    [ApiController]
    public class RefundController : ControllerBase
    {
        private readonly IRefundService _refundService;

        public RefundController(IRefundService refundService)
        {
            _refundService = refundService;
        }

        [HttpPost]
        [Route("one-ticket")]
        public IActionResult MakeRefundOneTicket(int ticketId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }
            //var username = User.Identity.Name;
            var refund = _refundService.RefundMoneyToCustomer(ticketId);

            if (refund == "Not found route ticket")
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, refund);
            }

            return Ok();
        }

        [HttpPost]
        [Route("all-ticket")]
        public IActionResult MakeRefundAllTicket(int ticketId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }
            //var username = User.Identity.Name;
            var refund = _refundService.RefundMoneyToCustomer(ticketId);

            if (refund == "Not found route ticket")
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, refund);
            }

            return Ok();
        }
    }
}