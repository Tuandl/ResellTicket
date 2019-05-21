using AutoMapper;
using Core.Models;
using ViewModel.ViewModel.User;

namespace ViewModel.AutoMapper
{
    public class DomainToViewModelConfiguration : Profile
    {
        public DomainToViewModelConfiguration()
        {
            CreateMap<UserViewModel, User>();
        }
    }
}
