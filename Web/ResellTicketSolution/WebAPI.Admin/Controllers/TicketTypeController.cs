using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using ViewModel.ViewModel.TicketType;

namespace WebAPI.Admin.Controllers
{
    [Route("api/tickettype")]
    [ApiController]
    public class TicketTypeController : ControllerBase
    {
        private readonly ITicketTypeService _ticketTypeService;

        public TicketTypeController(ITicketTypeService ticketTypeService)
        {
            _ticketTypeService = ticketTypeService;
        }

        [HttpGet]
        [Route("")]
        public ActionResult<TickeTypeDataTable> getTicketType(string param, int page, int pageSize)
        {
            var ticketTypeRowViewModels = _ticketTypeService.GetTicketType(param, page, pageSize);
            return ticketTypeRowViewModels;
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<TicketTypeRowViewModel> FindTicketById(int id)
        {
            var ticketTypeRowViewModels = _ticketTypeService.FindTicketTypeById(id);
            return ticketTypeRowViewModels;
        }

        [HttpPut]
        [Route("")]
        public ActionResult UpdateTicketType(TicketTypeRowViewModel model)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest("Invalid Request");
            //}

            var updateResult = _ticketTypeService.UpdateTicketType(model);

            if (!string.IsNullOrEmpty(updateResult))
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, updateResult);
            }
            return Ok();

        }
        [HttpPost]
        [Route("")]
        public ActionResult CreateTicketType(TicketTypeCreateViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }
            var createResult = _ticketTypeService.CreateTicketType(model);
            if (createResult == false)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, createResult);
            }
            return Ok();
        }

        [HttpPut]
        [Route("delete")]
        public ActionResult DeleteTicketType(int Id)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest("Invalid Request");
            //}

            var updateResult = _ticketTypeService.DeleteTicketType(Id);

            if (!string.IsNullOrEmpty(updateResult))
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, updateResult);
            }
            return Ok();
        }

    }
}