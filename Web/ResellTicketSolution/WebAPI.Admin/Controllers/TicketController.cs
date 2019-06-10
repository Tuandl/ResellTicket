using System;
using System.Collections.Generic;
using System.Linq;
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

        /// <summary>
        /// Approve Ticket
        /// </summary>
        /// <returns></returns>
        [HttpPost("{id}")]
        public ActionResult<TicketRowViewModel> ApproveTicket(int id)
        {
            var ticketRowViewModel = _ticketService.ApproveTicket(id);
            return ticketRowViewModel;
        }
    }
}