﻿using Core.Enum;
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

        public RouteController(
                IRouteService routeService
            )
        {
            _routeService = routeService;
        }


        /// <summary>
        /// Search Route by some criterials
        /// </summary>
        /// <param name="departureCityId">Departure City Id</param>
        /// <param name="arrivalCityId">Arrival City</param>
        /// <param name="maxTicketCombination">Max Ticket Combination</param>
        /// <param name="page">Current Page</param>
        /// <param name="pageSize">Size of a page</param>
        /// <returns>Search Result</returns>
        [HttpGet("search")]
        public IActionResult SearchRoute(
            int departureCityId,
            int arrivalCityId,
            int maxTicketCombination,
            int page,
            int pageSize)
        {
            try
            {
                var routes = _routeService.SearchRoute(departureCityId, arrivalCityId,
                    page, pageSize, maxTicketCombination
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
                _routeService.AddRoute(routeSearchViewModel, userName);
                return Ok();
            }
            catch(NotFoundException)
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
                var routeDataTable = _routeService.GetRouteDataTable(page, pageSize, status);
                return Ok(routeDataTable);
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
    }
}