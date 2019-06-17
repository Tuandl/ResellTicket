using AutoMapper;
using Core.Models;
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
                .ForMember(dest => dest.DepartureCityName, option => option.MapFrom(source => source.Departure.City.Name))
                .ForMember(dest => dest.ArrivalCityName, option => option.MapFrom(source => source.Arrival.City.Name))
                .ForMember(dest => dest.Vehicle, option => option.MapFrom(source => source.Transportation.Vehicle.Name));
            CreateMap<Ticket, TicketDetailViewModel>()
                .ForMember(dest => dest.VehicleId, option => option.MapFrom(source => source.Transportation.VehicleId))
                .ForMember(dest => dest.DepartureCityId, option => option.MapFrom(source => source.Departure.CityId))
                .ForMember(dest => dest.ArrivalCityId, option => option.MapFrom(source => source.Arrival.CityId));
        }
    }
}
