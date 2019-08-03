using Core.Enum;
using Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.EmailService;
using Service.Services;
using System;
using System.Net;
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
        private readonly ISendGridService _sendGridService;

        public RouteController(
                IRouteService routeService,
                ITicketService ticketService,
                IPaymentService paymentService,
                ISendGridService sendGridService
            )
        {
            _routeService = routeService;
            _ticketService = ticketService;
            _paymentService = paymentService;
            _sendGridService = sendGridService;
        }

        /// <summary>
        /// Search Route by some criterials
        /// </summary>
        /// <param name="paramsModel">Filters for searching routes.</param>
        /// <returns>Search Result</returns>
        [HttpPost("search")]
        [AllowAnonymous]
        public IActionResult SearchRoute(
            SearchRouteParamViewModel paramsModel)
        {
            try
            {
                //Set departureDate is the begin of this day
                paramsModel.DepartureDate = paramsModel.DepartureDate.Date;
                //Set arrivalDate is the end of this day
                paramsModel.ArrivalDate = paramsModel.ArrivalDate.Date.AddDays(1).AddMilliseconds(-1);

                var routes = _routeService.SearchRoute(paramsModel.DepartureCityId, paramsModel.ArrivalCityId,
                    paramsModel.DepartureDate, paramsModel.ArrivalDate, paramsModel.Page, paramsModel.PageSize,
                    User.Identity.Name, paramsModel.MaxTicketCombination, paramsModel.VehicleIds, 
                    paramsModel.TransportationIds, paramsModel.MaxWaitingHours, paramsModel.TicketTypeIds
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
                var changeStatusRoute = _routeService.BuyRoute(model, username);
                if (!string.IsNullOrEmpty(changeStatusRoute))
                {
                    return StatusCode((int)HttpStatusCode.NotAcceptable, changeStatusRoute);
                }
                _paymentService.MakePayment(model.RouteId);
                _sendGridService.SendEmailReceiptForBuyer(model.RouteId);
                return Ok();
            }
            catch (Exception ex)
            {
                //return BadRequest(ex.GetRootException().Message);
                return StatusCode((int)HttpStatusCode.NotAcceptable, ex.Message);
            }
        }
    }
}