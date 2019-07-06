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
using ViewModel.ViewModel.Ticket;

namespace WebAPI.Controllers
{
    [Route("api/ticket")]
    [ApiController]
    //[Authorize]
    public class TicketController : ControllerBase
    {
        private readonly ITicketService _ticketService;
        private readonly IRefundService _refundService;

        public TicketController(ITicketService ticketService, IRefundService refundService)
        {
            _ticketService = ticketService;
            _refundService = refundService;
        }

        [HttpPost]
        [Authorize]
        public ActionResult PostTicket(TicketPostViewModel model) 
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }
            try
            {
                var username = User.Identity.Name;
                int Id = _ticketService.PostTicket(username, model);
                return Ok(Id);
            }
            catch (Exception e)
            {
                return StatusCode((int) HttpStatusCode.NotAcceptable, e.Message);
            }
        }

        [HttpGet]
        [Authorize]
        public ActionResult<List<CustomerTicketViewModel>> GetCustomerTickets(int page, int pageSize, TicketStatus? status = null)
        {
            try
            {
                var username = User.Identity.Name;
                var customerTicketVMs = _ticketService.GetCustomerTickets(username, page, pageSize, status);
                return Ok(customerTicketVMs);
            } catch(Exception e)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, e.Message);
            }
        }

        [HttpGet("detail")]
        [Authorize]
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
        [Authorize]
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
        [Authorize]
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

        [HttpPost("confirm-rename")]
        public ActionResult ConfirmRenameTicket(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }

            var renameResult = _ticketService.ConfirmRenameTicket(id);

            if (!string.IsNullOrEmpty(renameResult))
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, renameResult);
            }
            return Ok();
        }

        [HttpPut("refuse")]
        public ActionResult RefuseTicket(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }

            var refundResult = _refundService.RefundMoneyToCustomer(id);

            if (!string.IsNullOrEmpty(refundResult))
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, refundResult);
            }

            var rejectResult = _ticketService.RefuseTicket(id);

            if (!string.IsNullOrEmpty(rejectResult))
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, rejectResult);
            }

            

            
            return Ok();
        }
    }
}