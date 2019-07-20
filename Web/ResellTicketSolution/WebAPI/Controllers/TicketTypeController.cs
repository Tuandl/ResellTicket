using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using ViewModel.ViewModel.TicketType;

namespace WebAPI.Controllers
{
    [Route("api/ticketType")]
    [ApiController]
    public class TicketTypeController : ControllerBase
    {
        public readonly ITicketTypeService _ticketTypeService;

        public TicketTypeController(ITicketTypeService ticketTypeService)
        {
            _ticketTypeService = ticketTypeService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<TicketTypeRowViewModel>> GetTicketTypeByVehicleId(int vehicleId, string ticketTypeName)
        {
            var ticketTypeRowVMs = _ticketTypeService.GetTicketTypesByVehicleId(vehicleId, ticketTypeName);
            return ticketTypeRowVMs;
        }
    }
}