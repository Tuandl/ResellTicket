using AutoMapper;
using Core.Models;
using ViewModel.ViewModel.User;
using ViewModel.ViewModel.Customer;
using ViewModel.ViewModel.Transportation;

namespace ViewModel.AutoMapper
{
    public class ViewModelToDomainConfiguration : Profile
    {
        public ViewModelToDomainConfiguration()
        {
            CreateMap<UserRegisterViewModel, User>();
            //    //Map fullname của userviewmodal vào Id của user
            //    ForMember(dest => dest.Id, option => option.MapFrom(source => source.FullName));
            CreateMap<CustomerRegisterViewModel, Customer>();
            CreateMap<TransportationCreateViewModel, Transportation>();
        }
    }
}
