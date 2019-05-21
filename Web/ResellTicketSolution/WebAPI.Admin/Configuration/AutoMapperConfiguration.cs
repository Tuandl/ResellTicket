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
            var configAssembly = Assembly.GetAssembly(typeof(DomainToViewModelConfiguration));
            services.AddAutoMapper(configAssembly);
        }
    }
}
