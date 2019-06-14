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
                .ForMember(dest => dest.DepartureCity, option => option.MapFrom(source => source.Departure.City.Name))
                .ForMember(dest => dest.ArrivalCity, option => option.MapFrom(source => source.Arrival.City.Name))
                .ForMember(dest => dest.Vehicle, option => option.MapFrom(source => source.Transportation.Vehicle.Name));
                
        }
    }
}
