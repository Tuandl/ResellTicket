using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using ViewModel.ViewModel.Vehicle;

namespace WebAPI.Admin.Controllers
{
    [Route("api/vehicle")]
    [ApiController]
    
    public class VehicleController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;

        public VehicleController(IVehicleService vehicleService)
        {
            _vehicleService = vehicleService;
        }

        [HttpGet]
        [Route("")]
        public ActionResult<IEnumerable<VehicleRowViewModel>> GetVehicle()
        {
            var vehicleRowViewModels = _vehicleService.GetVehicles();
            return vehicleRowViewModels;
        }
    }
}