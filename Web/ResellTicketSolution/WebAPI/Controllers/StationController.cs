using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using ViewModel.ViewModel.Station;

namespace WebAPI.Controllers
{
    [Route("api/station")]
    [ApiController]
    public class StationController : ControllerBase
    {
        private readonly IStationService _stationService;

        public StationController(IStationService stationService)
        {
            _stationService = stationService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<StationRowViewModel>> GetStationByCityId(int cityId, string name, int ignoreStationId)
        {
            var stationRowViewModels = _stationService.GetStationsByCityId(cityId, name, ignoreStationId);
            return stationRowViewModels;
        }
    }
}