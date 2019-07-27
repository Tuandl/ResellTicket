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
    
    public class RouteController : ControllerBase
    {
        private readonly IRouteService _routeService;

        public RouteController(IRouteService routeService)
        {
            _routeService = routeService;
        }

        [HttpGet]
        [Route("statistic")]
        [Authorize(Roles = "Manager")]
        public ActionResult GetStatisticResult()
        {
            try
            {
                var report = _routeService.GetStatisticReport();
                return Ok(report);
            }
            catch (Exception e)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, e.Message);
            }
        }

        [HttpGet]
        [Route("bought")]
        [Authorize(Roles = "Staff")]
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
        [Authorize(Roles = "Staff")]
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
        [Authorize]
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
        [Authorize]
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
        [Authorize(Roles = "Staff")]
        public ActionResult ReplaceOneFailTicket(int routeId, int failRouteTicketId, int replaceTicketId)
        {
            try
            {
                string username = User.Identity.Name;
                _routeService.ReplaceOneFailTicket(routeId, failRouteTicketId, replaceTicketId, username);
            } catch (Exception e)
            {
                return StatusCode((int)HttpStatusCode.NotAcceptable, e.Message);
            }
            
            return Ok();
        }
    }
}