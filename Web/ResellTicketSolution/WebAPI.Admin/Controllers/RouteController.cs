using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using ViewModel.ViewModel.Route;

namespace WebAPI.Admin.Controllers
{
    [Route("api/route")]
    [ApiController]
    [Authorize(Roles = "Staff")]
    public class RouteController : ControllerBase
    {
        private readonly IRouteService _routeService;

        public RouteController(IRouteService routeService)
        {
            _routeService = routeService;
        }

        [HttpGet]
        public ActionResult<RouteDataTable> GetLiabilityRoutes(string param, int page, int pageSize)
        {
            try
            {
                var routes = _routeService.GetLiabilityRoutes(param, page, pageSize);
                return routes;
            }
            catch (Exception e)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, e.Message);
            }
        }

        [HttpGet]
        [Route("detail")]
        public ActionResult<RouteDetailViewModel> getRouteDetail(int routeId)
        {
            try
            {
                var routeDetail = _routeService.GetRouteDetail(routeId);
                return routeDetail;
            }
            catch (Exception e)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, e.Message);
            }

        }
    }
}