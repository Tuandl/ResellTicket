using AutoMapper;
using Core.Models;
using ViewModel.ViewModel.User;

namespace ViewModel.AutoMapper
{
    public class ViewModelToDomainConfiguration : Profile
    {
        public ViewModelToDomainConfiguration()
        {
            CreateMap<UserViewModel, User>().
                //Map fullname của userviewmodal vào Id của user
                ForMember(dest => dest.Id, option => option.MapFrom(source => source.FullName));
            
        }
    }
}
