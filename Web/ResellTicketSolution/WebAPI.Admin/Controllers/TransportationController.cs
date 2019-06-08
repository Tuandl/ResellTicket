using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using ViewModel.ViewModel.Transportation;

namespace WebAPI.Admin.Controllers
{
    [Route("api/transportation")]
    [ApiController]
    
    public class TransportationController : ControllerBase
    {
        private readonly ITransportationService _transportationService;
        public TransportationController(ITransportationService transportationService)
        {
            _transportationService = transportationService;
        }
        [HttpPost]
        [Route("")]
        public IActionResult CreateTranspotation(TransportationCreateViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }
            var transpotation = _transportationService.CreateTransportation(model);
            if (transpotation == false)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, transpotation);
            }
            return Ok();
        }
        [HttpGet]
        [Route("")]
        public ActionResult<IEnumerable<TransportationRowViewModel>> GetTransportation(string param)
        {
            var transportation = _transportationService.GetTransportations(param);
            return transportation;
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<TransportationRowViewModel> FindTransportation(int id)
        {
            var transpotation = _transportationService.FindTransportationById(id);
            return transpotation;
        }

        [HttpPut]
        [Route("")]
        public ActionResult UpdateTransportation(TransportationUpdateViewModel model)
        {
            var updateResult = _transportationService.UpdateTransportation(model);

            if (!string.IsNullOrEmpty(updateResult))
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, updateResult);
            }
            return Ok();
        }

    }

}