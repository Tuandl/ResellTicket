using Microsoft.AspNetCore.Mvc;
using Service.Services;
using System;

namespace WebAPI.Admin.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimeZoneController : ControllerBase
    {
        private readonly ITimeZoneService _timeZoneService;

        public TimeZoneController(ITimeZoneService timeZoneService)
        {
            _timeZoneService = timeZoneService;
        }

        [HttpGet("")]
        public IActionResult GetTimeZoneOptions()
        {
            try
            {
                var result = _timeZoneService.GetAllTimeZoneOptions();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.GetBaseException().Message);
            }
        }

    }
}