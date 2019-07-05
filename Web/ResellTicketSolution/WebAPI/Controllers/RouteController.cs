using Core.Enum;
using Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using System;
using ViewModel.ErrorViewModel;
using ViewModel.ViewModel.Route;
using WebAPI.Extensions;

namespace WebAPI.Controllers
{
    [Route("api/Route")]
    [ApiController]
    [Authorize]
    public class RouteController : ControllerBase
    {
        private readonly IRouteService _routeService;
        private readonly ITicketService _ticketService;
        private readonly IPaymentService _paymentService;

        public RouteController(
                IRouteService routeService,
                ITicketService ticketService,
                IPaymentService paymentService
            )
        {
            _routeService = routeService;
            _ticketService = ticketService;
            _paymentService = paymentService;
        }

        /// <summary>
        /// Search Route by some criterials
        /// </summary>
        /// <param name="departureCityId">Departure City Id</param>
        /// <param name="arrivalCityId">Arrival City</param>
        /// <param name="maxTicketCombination">Max Ticket Combination</param>
        /// <param name="departureDate">Departure Date (Local departure city)</param>
        /// <param name="arrivalDate">Arrival Date (Local arrival city)</param>
        /// <param name="page">Current Page</param>
        /// <param name="pageSize">Size of a page</param>
        /// <returns>Search Result</returns>
        [HttpGet("search")]
        public IActionResult SearchRoute(
            int departureCityId,
            int arrivalCityId,
            int maxTicketCombination,
            DateTime departureDate,
            DateTime arrivalDate,
            int page,
            int pageSize)
        {
            try
            {
                //TODO: Convert departure time into UTC
                
                //Set departureDate is the begin of this day
                //Set arrivalDate is the end of this day
                departureDate = departureDate.Date;
                arrivalDate = arrivalDate.Date.AddDays(1).AddMilliseconds(-1);

                var routes = _routeService.SearchRoute(departureCityId, arrivalCityId,
                    departureDate, arrivalDate, page, pageSize, maxTicketCombination
                );

                return Ok(routes);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.GetRootException().Message);
            }
        }

        /// <summary>
        /// Create a route for this customer base on search result
        /// </summary>
        /// <param name="routeSearchViewModel">Search View Model</param>
        /// <returns></returns>
        [HttpPost("")]
        public IActionResult AddRouteFromSearchResult(RouteSearchViewModel routeSearchViewModel)
        {
            try
            {
                var userName = User.Identity.Name;
                var routeId = _routeService.AddRoute(routeSearchViewModel, userName);
                return Ok(routeId);
            }
            catch (NotFoundException)
            {
                return BadRequest("Cannot Create Route for this customer");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.GetRootException().Message);
            }
        }

        /// <summary>
        /// Get Route Detail By Id
        /// </summary>
        /// <param name="routeId">Route Id</param>
        /// <returns>Route Detail</returns>
        [HttpGet("{routeId}")]
        public IActionResult GetRouteDetail(int routeId)
        {
            try
            {
                var route = _routeService.GetRouteDetail(routeId);
                return Ok(route);
            }
            catch (NotFoundException)
            {
                return BadRequest("Not Found");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.GetRootException().Message);
            }
        }

        /// <summary>
        /// Get route data table for paging
        /// </summary>
        /// <param name="page">page</param>
        /// <param name="pageSize">page size</param>
        /// <param name="status">route status</param>
        /// <returns>Data Table of routes</returns>
        [HttpGet("data-table")]
        public IActionResult GetRouteDataTable(int page,
            int pageSize, RouteStatus? status = null)
        {
            try
            {
                var routeDataTable = _routeService.GetRouteDataTable(page, pageSize, status, User.Identity.Name);
                return Ok(routeDataTable);
            }
            catch (NotFoundException)
            {
                return BadRequest("Not Found");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.GetRootException().Message);
            }
        }

        /// <summary>
        /// Update Route
        /// </summary>
        /// <param name="route">Route Detail viewmodel</param>
        /// <returns></returns>
        [HttpPut("")]
        public IActionResult UpdateRoute(RouteDetailViewModel route)
        {
            try
            {
                _routeService.UpdateRoute(route);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.GetRootException().Message);
            }
        }

        /// <summary>
        /// Delete route
        /// </summary>
        /// <param name="routeId">Route Id</param>
        /// <returns></returns>
        [HttpDelete("{routeId}")]
        public IActionResult DeleteRoute(int routeId)
        {
            try
            {
                _routeService.DeleteRoute(routeId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.GetRootException().Message);
            }
        }

        /// <summary>
        /// replace new Ticket for existed route ticket
        /// </summary>
        /// <param name="paramsModel">Params</param>
        /// <returns></returns>
        [HttpPut("route-ticket")]
        public IActionResult UpdateRouteTicket(RouteTicketUpdateParams paramsModel)
        {
            try
            {
                _routeService.UpdateRouteTicket(paramsModel);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.GetRootException().Message);
            }
        }

        /// <summary>
        /// Get Updateable ticket for this route ticket
        /// </summary>
        /// <param name="routeTicketId">Route Ticket Id</param>
        /// <returns></returns>
        [HttpGet("route-ticket/{routeTicketId}/ticket")]
        public IActionResult GetAvailableTicketForRouteTicket(int routeTicketId)
        {
            try
            {
                var tickets = _ticketService.GetTicketAvailableForRouteTicket(routeTicketId);
                return Ok(tickets);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.GetRootException().Message);
            }
        }

        [HttpPost("buy-route")]
        public ActionResult BuyRoute(BuyRouteParams model)
        {
            var username = User.Identity.Name;
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }
            try
            {
                _routeService.BuyRoute(model, username);
                _paymentService.MakePayment(model.RouteId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.GetRootException().Message);
            }
        }
    }
}