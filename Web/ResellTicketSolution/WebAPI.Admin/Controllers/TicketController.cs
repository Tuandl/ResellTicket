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
    }
}