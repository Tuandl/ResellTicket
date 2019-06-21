using AutoMapper;
using Core.Models;
using ViewModel.ViewModel.User;
using ViewModel.ViewModel.Customer;
using ViewModel.ViewModel.Transportation;
using ViewModel.ViewModel.City;
using ViewModel.ViewModel.Ticket;
using ViewModel.ViewModel.TicketType;
using ViewModel.ViewModel.Route;

namespace ViewModel.AutoMapper
{
    public class ViewModelToDomainConfiguration : Profile
    {
        public ViewModelToDomainConfiguration()
        {
            CreateMap<UserRegisterViewModel, User>();
            CreateMap<UserProfileViewModel, User>();
            //    //Map fullname của userviewmodal vào Id của user
            //    ForMember(dest => dest.Id, option => option.MapFrom(source => source.FullName));
            CreateMap<CustomerRegisterViewModel, Customer>();
            CreateMap<TransportationCreateViewModel, Transportation>();
            CreateMap<CityUpdateViewModel, City>();
            CreateMap<TicketTypeCreateViewModel, TicketType>();
            CreateMap<TicketPostViewModel, Ticket>();
            CreateMap<TicketEditViewModel, Ticket>();

            CreateMap<RouteDetailViewModel, Route>();
            CreateMap<RouteTicketDetailViewModel, RouteTicket>();
            CreateMap<RouteTicketSearchViewModel, RouteTicket>();
        }
    }
}
