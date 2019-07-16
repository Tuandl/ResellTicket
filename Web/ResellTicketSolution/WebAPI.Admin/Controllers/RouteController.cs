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
        [Route("bought")]
        public ActionResult<RouteDataTable> GetBoughtRoutes(string param, int page, int pageSize)
        {
            try
            {
                var routes = _routeService.GetBoughtRoutes(param, page, pageSize);
                return routes;
            }
            catch (Exception e)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, e.Message);
            }
        }

        [HttpGet]
        [Route("liability")]
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
        [Route("completed")]
        public ActionResult<RouteDataTable> GetCompletedRoutes(string param, int page, int pageSize)
        {
            try
            {
                var routes = _routeService.GetCompletedRoutes(param, page, pageSize);
                return routes;
            }
            catch (Exception e)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, e.Message);
            }
        }

        [HttpGet]
        [Route("detail")]
        public ActionResult<RouteDetailViewModel> GetRouteDetail(int routeId)
        {
            try
            {
                var routeDetail = _routeService.GetRouteDetailForAdmin(routeId);
                return Ok(routeDetail);
            }
            catch (Exception e)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, e.Message);
            }

        }

        [HttpPost]
        [Route("replaceOneFail")]
        public ActionResult ReplaceOneFailTicket(int routeId, int failRouteTicketId, int replaceTicketId)
        {
            try
            {
                _routeService.ReplaceOneFailTicket(routeId, failRouteTicketId, replaceTicketId);
            } catch (Exception e)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, e.Message);
            }
            
            return Ok();
        }
    }
}