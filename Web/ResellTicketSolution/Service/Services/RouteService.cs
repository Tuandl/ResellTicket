using Core.Infrastructure;
using Core.Repository;
using System;
using System.Collections.Generic;
using System.Text;
using ViewModel.ViewModel.Route;

namespace Service.Services
{
    public interface IRouteService
    {
        RouteSearchViewModel SearchRoute(int departureId, int arrivalId);
    }

    public class RouteService : IRouteService
    {
        private readonly IRouteRepository _routeRepository;
        private readonly IRouteTicketRepository _routeTicketRepository;
        private readonly ICityRepository _cityRepository;
        private readonly IUnitOfWork _unitOfWork;

        public RouteService(
                IRouteRepository routeRepository,
                IRouteTicketRepository routeTicketRepository,
                IUnitOfWork unitOfWork
            )
        {
            _routeRepository = routeRepository;
            _routeTicketRepository = routeTicketRepository;
            _unitOfWork = unitOfWork;
        }

        public RouteSearchViewModel SearchRoute(int departureId, int arrivalId)
        {
            throw new NotImplementedException();
        }
    }
}
