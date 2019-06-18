using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using ViewModel.ViewModel.Ticket;

namespace WebAPI.Admin.Controllers
{
    [Route("api/ticket")]
    [ApiController]
    [Authorize(Roles = "Staff")]
    public class TicketController : ControllerBase
    {
        private readonly ITicketService _ticketService;

        public TicketController(ITicketService ticketService)
        {
            _ticketService = ticketService;
        }

        /// <summary>
        /// Get All Tickets
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult<IEnumerable<TicketRowViewModel>> GetTickets()
        {
            var tickets = _ticketService.GetTickets();
            return tickets;
        }
        [HttpGet("pending")]
        public ActionResult<IEnumerable<TicketRowViewModel>> GetPendingTickets()
        {
            var tickets = _ticketService.GetPendingTickets();
            return tickets;
        }

        [HttpGet("valid")]
        public ActionResult<IEnumerable<TicketRowViewModel>> GetValidTickets()
        {
            var tickets = _ticketService.GetValidTickets();
            return tickets;
        }

        [HttpGet("renamed")]
        public ActionResult<IEnumerable<TicketRowViewModel>> GetRenamedTickets()
        {
            var tickets = _ticketService.GetRenamedTickets();
            return tickets;
        }

        [HttpGet("bought")]
        public ActionResult<IEnumerable<TicketRowViewModel>> GetBoughtTickets()
        {
            var tickets = _ticketService.GetBoughtTickets();
            return tickets;
        }

        [HttpGet("completed")]
        public ActionResult<IEnumerable<TicketRowViewModel>> GetCompletedTickets()
        {
            var tickets = _ticketService.GetCompletedTickets();
            return tickets;
        }

        /// <summary>
        /// Approve Ticket
        /// </summary>
        /// <returns></returns>
        [HttpPut("approve/{id}")]
        public ActionResult ApproveTicket(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }

            var approveResult = _ticketService.ApproveTicket(id);

            if (!string.IsNullOrEmpty(approveResult))
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, approveResult);
            }
            return Ok();
        }

        [HttpPost("validate-rename")]
        public ActionResult ValidateRenameTicket(int id, bool renameSuccess)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }

            var validResult = _ticketService.ValidateRenameTicket(id, renameSuccess);

            if (!string.IsNullOrEmpty(validResult))
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, validResult);
            }
            return Ok();
        }
    }
}