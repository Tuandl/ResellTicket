using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using ViewModel.ViewModel.Station;

namespace WebAPI.Admin.Controllers
{
    [Route("api/station")]
    [ApiController]
    [Authorize(Roles = "Manager")]
    public class StationController : ControllerBase
    {
        private readonly IStationService _stationService;

        public StationController(IStationService stationService)
        {
            _stationService = stationService;
        }

        [HttpPost]
        public ActionResult CreateStation(StationCreateViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }
            var createResult = _stationService.CreateStation(model);
            if (createResult == false)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, createResult);
            }
            return Ok();
        }

        [HttpGet("{id}")]
        public ActionResult<StationRowViewModel> FindStationById(int id)
        {
            var stationRowViewModel = _stationService.FindStationById(id);
            return stationRowViewModel;
        }

        [HttpGet]
        public ActionResult<StationDataTable> GetStations(string param, int page, int pageSize)
        {
            var stationRowViewModels = _stationService.GetStations(param, page, pageSize);
            return stationRowViewModels;
        }

        [HttpPut]
        public ActionResult UpdateCity(StationUpdateViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }

            var updateResult = _stationService.UpdateStation(model);

            if (!string.IsNullOrEmpty(updateResult))
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, updateResult);
            }
            return Ok();
        }



    }
}
