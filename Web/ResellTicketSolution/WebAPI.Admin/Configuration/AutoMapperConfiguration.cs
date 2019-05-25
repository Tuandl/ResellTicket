using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using ViewModel.AutoMapper;

namespace WebAPI.Admin.Configuration
{
    public static class AutoMapperConfiguration
    {
        public static void AddAutoMapperConfiguration(this IServiceCollection services)
        {
            //lấy cái dll chưa config của automapper
            var configAssembly = Assembly.GetAssembly(typeof(DomainToViewModelConfiguration));
            //Lấy ra tất các class là con của class Profile
            services.AddAutoMapper(configAssembly);
        }
    }
}
