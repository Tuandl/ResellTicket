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
        private readonly IPayoutService _payoutService;
        private readonly IRefundService _refundService;
        public TicketController(ITicketService ticketService, IPayoutService payoutService, IRefundService refundService)
        {
            _ticketService = ticketService;
            _payoutService = payoutService;
            _refundService = refundService;
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
        public ActionResult<TicketDataTable> GetPendingTickets(string param, int page, int pageSize)
        {
            var tickets = _ticketService.GetPendingTickets(param, page, pageSize);
            return tickets;
        }

        [HttpGet("valid")]
        public ActionResult<TicketDataTable> GetValidTickets(string param, int page, int pageSize)
        {
            var tickets = _ticketService.GetValidTickets(param, page, pageSize);
            return tickets;
        }

        [HttpGet("renamed")]
        public ActionResult<TicketDataTable> GetRenamedTickets(string param, int page, int pageSize)
        {
            var tickets = _ticketService.GetRenamedTickets(param, page, pageSize);
            return tickets;
        }

        [HttpGet("bought")]
        public ActionResult<TicketDataTable> GetBoughtTickets(string param, int page, int pageSize)
        {
            var tickets = _ticketService.GetBoughtTickets(param, page, pageSize);
            return tickets;
        }

        [HttpGet("completed")]
        public ActionResult<TicketDataTable> GetCompletedTickets(string param, int page, int pageSize)
        {
            var tickets = _ticketService.GetCompletedTickets(param, page, pageSize);
            return tickets;
        }

        [HttpGet("invalid")]
        public ActionResult<TicketDataTable> GetInValidTickets(string param, int page, int pageSize)
        {
            var tickets = _ticketService.GetInValidTickets(param, page, pageSize);
            return tickets;
        }

        [HttpGet("search")]
        public ActionResult<IEnumerable<TicketRowViewModel>> GetSearchTickets(string param)
        {
            var ticketRowViewModels = _ticketService.GetTickets(param);
            return ticketRowViewModels;
        }

        [HttpGet("detail")]
        [Authorize]
        public ActionResult<TicketDetailViewModel> GetTicketDetail(int ticketId)
        {
            try
            {
                var ticketDetailVM = _ticketService.GetTicketDetail(ticketId);
                return Ok(ticketDetailVM);
            }
            catch (Exception e)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, e.Message);
            }
        }

        /// <summary>
        /// Approve Ticket
        /// </summary>
        /// <returns></returns>
        [HttpPut("approve/{id}")]
        public ActionResult ApproveTicket(int id, decimal commissionFee, DateTime expiredDateTime)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }

            try
            {
                var approveResult = _ticketService.ApproveTicket(id, commissionFee, expiredDateTime);

                if (!string.IsNullOrEmpty(approveResult))
                {
                    return StatusCode((int)HttpStatusCode.NotAcceptable, approveResult);
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, ex.Message);
            }
        }

        /// <summary>
        /// Reject Ticket
        /// </summary>
        /// <returns></returns>
        [HttpPut("reject/{id}")]
        public ActionResult RejectTicket(int id, string invalidField)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }

            var rejectResult = _ticketService.RejectTicket(id, invalidField);

            if (!string.IsNullOrEmpty(rejectResult))
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, rejectResult);
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

            //if (renameSuccess)
            //{
            //    //valid thì make Payout cho số tiền 1 vé cho  người SELLER
            //    var payoutResult = _payoutService.MakePayoutToCustomer(id);

            //    if (!string.IsNullOrEmpty(payoutResult))
            //    {
            //        return StatusCode((int)HttpStatusCode.NotAcceptable, payoutResult);
            //    }
            //} else
            //{
            //    //invalid thì make Refund cho số tiền 1 ROUTE cho  người BUYER
            //    var refundResult = _refundService.RefundMoneyToCustomer(id);

            //    if (!string.IsNullOrEmpty(refundResult))
            //    {
            //        return StatusCode((int)HttpStatusCode.NotAcceptable, refundResult);
            //    }
            //}
            return Ok();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="failRouteTicketId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("replaceOneFail")]
        public ActionResult<AvailableTicketDataTable> GetReplaceTicketForOneFailTicket(int failRouteTicketId)
        {
            var replaceTickets = _ticketService.GetReplaceTicketForOneFailTicket(failRouteTicketId);
            return replaceTickets;
        }
    }
}