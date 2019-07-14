using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Core.Enum;
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
        public IActionResult MakeRefundOneTicket(int ticketId, ResolveOption? resolveOption = null)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }
            try
            {
                _refundService.RefundFailTicketMoneyToCustomer(ticketId, resolveOption);
            }
            catch (Exception e)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, e.Message);
            }

            return Ok();
        }

        [HttpPost]
        [Route("all-ticket")]
        public IActionResult MakeRefundAllTicket(int ticketId, ResolveOption? resolveOption = null)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }
            //var username = User.Identity.Name;
            var refund = _refundService.RefundToTalMoneyToCustomer(ticketId, resolveOption);

            if (refund == "Not found route ticket")
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, refund);
            }

            return Ok();
        }
    }
}