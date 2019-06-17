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

namespace WebAPI.Controllers
{
    [Route("api/ticket")]
    [ApiController]
    //[Authorize]
    public class TicketController : ControllerBase
    {
        private readonly ITicketService _ticketService;

        public TicketController(ITicketService ticketService)
        {
            _ticketService = ticketService;
        }

        [HttpPost]
        public ActionResult PostTicket(TicketPostViewModel model) 
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }
            try
            {
                _ticketService.PostTicket(model);
            }
            catch (Exception e)
            {
                return StatusCode((int) HttpStatusCode.NotAcceptable, e.Message);
            }
            
            return Ok();
        }

        [HttpGet]
        public ActionResult<List<CustomerTicketViewModel>> GetCustomerTickets(int customerId, int page)
        {

            try
            {
                var customerTicketVMs = _ticketService.GetCustomerTickets(customerId, page);
                return Ok(customerTicketVMs);
            } catch(Exception e)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, e.Message);
            }
        }

        [HttpGet("detail")]
        public ActionResult<TicketDetailViewModel> GetTicketDetail(int ticketId)
        {
            try
            {
                var ticketDetailVM = _ticketService.GetTicketDetail(ticketId);
                return Ok(ticketDetailVM);
            }catch(Exception e)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, e.Message);
            }
        }

        [HttpPut]
        public ActionResult UpdateCustomerTicket(TicketEditViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }
            try
            {
                _ticketService.EditTicket(model);
                return Ok();
            } catch(Exception e)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, e.Message);
            }
        }

        [HttpDelete]
        public ActionResult DeleteCustomerTicket(int ticketId)
        {
            try
            {
                _ticketService.DeleteTicket(ticketId);
                return Ok();
            } catch(Exception e)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, e.Message);
            }
        }
    }
}