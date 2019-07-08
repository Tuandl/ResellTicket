using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using System.Collections.Generic;
using System.Net;
using ViewModel.ViewModel.City;

namespace WebAPI.Admin.Controllers
{
    [Route("api/city")]
    [ApiController]
    [Authorize(Roles = "Manager")]
    public class CityController : ControllerBase
    {
        private readonly ICityService _cityService;

        public CityController(ICityService cityService)
        {
            _cityService = cityService;
        }

        [HttpPost]
        public ActionResult CreateCity(CityRowViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }
            var createResult = _cityService.CreateCity(model);
            if (createResult == false)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, createResult);
            }
            return Ok();
        }

        [HttpGet]
        public ActionResult<IEnumerable<CityRowViewModel>> GetCities(string param)
        {
            var cityRowViewModels = _cityService.GetCities(param);
            return cityRowViewModels;
        }

        [HttpGet("{id}")]
        public ActionResult<CityRowViewModel> FindCityById(int id)
        {
            var cityRowViewModel = _cityService.FindCityById(id);
            return cityRowViewModel;
        }

        [HttpPut]
        public ActionResult UpdateCity(CityUpdateViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }

            var updateResult = _cityService.UpdateCity(model);

            if (!string.IsNullOrEmpty(updateResult))
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, updateResult);
            }
            return Ok();
        }
    }
}