using AutoMapper;
using Core.Models;
using ViewModel.ViewModel.Route;
using ViewModel.ViewModel.Station;
using ViewModel.ViewModel.Ticket;
using ViewModel.ViewModel.User;

namespace ViewModel.AutoMapper
{
    public class DomainToViewModelConfiguration : Profile
    {
        public DomainToViewModelConfiguration()
        {
            CreateMap<User, UserRowViewModel>();
            CreateMap<Ticket, TicketRowViewModel>()
                .ForMember(dest => dest.DepartureCity, option => option.MapFrom(source => source.DepartureStation.City.Name))
                .ForMember(dest => dest.ArrivalCity, option => option.MapFrom(source => source.ArrivalStation.City.Name));
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
            CreateMap<RouteTicket, RouteTicketDetailViewModel>()
                .ForMember(dest => dest.ArrivalCityName, otp => otp.MapFrom(src => src.ArrivalStation.City.Name))
                .ForMember(dest => dest.ArrivalDateTime, otp => otp.MapFrom(src => src.Ticket.ArrivalDateTime))
                .ForMember(dest => dest.ArrivalStationName, otp => otp.MapFrom(src => src.ArrivalStation.Name))
                .ForMember(dest => dest.DepartureCityName, otp => otp.MapFrom(src => src.DepartureStation.City.Name))
                .ForMember(dest => dest.DepartureDateTime, otp => otp.MapFrom(src => src.Ticket.DepartureDateTime))
                .ForMember(dest => dest.DepartureStationName, otp => otp.MapFrom(src => src.DepartureStation.Name))
                .ForMember(dest => dest.SellingPrice, otp => otp.MapFrom(src => src.Ticket.SellingPrice))
                .ForMember(dest => dest.Status, otp => otp.MapFrom(src => src.Ticket.Status))
                .ForMember(dest => dest.TicketCode, otp => otp.MapFrom(src => src.Ticket.TicketCode))
                .ForMember(dest => dest.TransportationName, otp => otp.MapFrom(src => src.Ticket.Transportation.Name))
                .ForMember(dest => dest.TicketId, otp => otp.MapFrom(src => src.TicketId))
                .ForMember(dest => dest.TicketTypeId, otp => otp.MapFrom(src => src.Ticket.TicketTypeId))
                .ForMember(dest => dest.TicketTypeName, otp => otp.MapFrom(src => src.Ticket.TicketType.Name))
                .ForMember(dest => dest.VehicleName, otp => otp.MapFrom(src => src.Ticket.Transportation.Vehicle.Name));

            CreateMap<Station, StationRowViewModel>()
                .ForMember(dest => dest.CityId, option => option.MapFrom(src => src.CityId))
                .ForMember(dest => dest.CityName, option => option.MapFrom(src => src.City.Name));
        }
    }
}
