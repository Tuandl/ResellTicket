using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using ViewModel.ViewModel.Transportation;

namespace WebAPI.Controllers
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

        [HttpGet]
        public ActionResult<IEnumerable<TransportationRowViewModel>> GetTransportationsByVehicleId(int vehicleId, string transportationName)
        {
            var transportationRowVMs = _transportationService.GetTransportationsByVehicleId(vehicleId, transportationName);
            return transportationRowVMs;
        }
    }
}