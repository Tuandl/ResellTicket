using AutoMapper;
using Core.Models;
using ViewModel.ViewModel.Route;
using ViewModel.ViewModel.Ticket;
using ViewModel.ViewModel.User;

namespace ViewModel.AutoMapper
{
    public class DomainToViewModelConfiguration : Profile
    {
        public DomainToViewModelConfiguration()
        {
            CreateMap<User, UserRowViewModel>();
            CreateMap<Ticket, TicketRowViewModel>();

            CreateMap<Route, RouteDetailViewModel>();
            CreateMap<RouteTicket, RouteTicketDetailViewModel>();

        }
    }
}
