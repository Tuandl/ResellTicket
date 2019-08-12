using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Core.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Services;

namespace WebAPI.Admin.Controllers
{
    [Route("api/refund")]
    [ApiController]
    [Authorize(Roles = "Staff")]
    public class RefundController : ControllerBase
    {
        private readonly IRefundService _refundService;

        public RefundController(IRefundService refundService)
        {
            _refundService = refundService;
        }

        [HttpPost]
        [Route("one-ticket")]
        [Authorize(Roles = "Staff")]
        public IActionResult MakeRefundOneTicket(int ticketId, ResolveOption resolveOption)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }
            try
            {
                string userName = User.Identity.Name;
                _refundService.RefundFailTicketMoneyToCustomer(ticketId, resolveOption, userName);
            }
            catch (Exception e)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, e.Message);
            }

            return Ok();
        }

        [HttpPost]
        [Route("all-ticket")]
        [Authorize(Roles = "Staff")]
        public IActionResult MakeRefundAllTicket(int ticketId, ResolveOption resolveOption)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }
            try
            {
                var username = User.Identity.Name;
                var refund = _refundService.RefundToTalMoneyToCustomer(ticketId, resolveOption, username);

                if (refund == "Not found route ticket")
                {
                    return StatusCode((int)HttpStatusCode.NotAcceptable, refund);
                }

                return Ok();
            }
            catch (Exception e)
            {

                return StatusCode((int)HttpStatusCode.NotAcceptable, e.Message);
            }
        }
    }
}