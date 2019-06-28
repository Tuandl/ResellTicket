using System;
using System.Collections.Generic;
using System.Text;
using AutoMapper;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using ViewModel.ViewModel.RouteTicket;

namespace Service.Services
{
    public interface IRouteTicketService
    {
        RouteTicket GetRoute(int TicketId);
        bool RemoveTicketInRoute(int TicketId, int RouteId);
    }
    public class RouteTicketService: IRouteTicketService
    {
        private readonly IRouteTicketRepository _routeTicketRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public RouteTicketService(IRouteTicketRepository routeTicketRepository, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _routeTicketRepository = routeTicketRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        public RouteTicket GetRoute(int TicketId)
        {
            var routeTicket = _routeTicketRepository.Get(x => x.TicketId == TicketId & x.Deleted == false);
            //var routeTicketRowViewModel = _mapper.Map<RouteTicket, RouteTicketRowViewModel>(routeTicket);
            return routeTicket;
        }

        public bool RemoveTicketInRoute(int TicketId, int RouteId)
        {
            var ticketInRoute = _routeTicketRepository.Get(x => x.RouteId == RouteId & x.TicketId == TicketId);
            if(ticketInRoute == null)
            {
                return false;
            }

            ticketInRoute.Deleted = true;
            _routeTicketRepository.Update(ticketInRoute);
            _unitOfWork.CommitChanges();
            return true;
        }
    }
}
