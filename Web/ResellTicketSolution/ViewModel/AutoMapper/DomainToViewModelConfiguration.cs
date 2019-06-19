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
            CreateMap<Ticket, CustomerTicketViewModel>()
                .ForMember(dest => dest.DepartureCityName, option => option.MapFrom(source => source.DepartureStation.City.Name))
                .ForMember(dest => dest.ArrivalCityName, option => option.MapFrom(source => source.ArrivalStation.City.Name))
                .ForMember(dest => dest.Vehicle, option => option.MapFrom(source => source.Transportation.Vehicle.Name));
            CreateMap<Ticket, TicketDetailViewModel>()
                .ForMember(dest => dest.VehicleId, option => option.MapFrom(source => source.Transportation.VehicleId))
                .ForMember(dest => dest.VehicleName, option => option.MapFrom(source => source.Transportation.Vehicle.Name))
                .ForMember(dest => dest.TransportationName, option => option.MapFrom(source => source.Transportation.Name))
                .ForMember(dest => dest.TicketTypeName, option => option.MapFrom(source => source.TicketType.Name))
                .ForMember(dest => dest.DepartureCityName, option => option.MapFrom(source => source.DepartureStation.City.Name))
                .ForMember(dest => dest.DepartureStationName, option => option.MapFrom(source => source.DepartureStation.Name))
                .ForMember(dest => dest.ArrivalCityName, option => option.MapFrom(source => source.ArrivalStation.City.Name))
                .ForMember(dest => dest.ArrivalStationName, option => option.MapFrom(source => source.ArrivalStation.Name));

            CreateMap<Route, RouteDetailViewModel>();
            CreateMap<RouteTicket, RouteTicketDetailViewModel>();

        }
    }
}
