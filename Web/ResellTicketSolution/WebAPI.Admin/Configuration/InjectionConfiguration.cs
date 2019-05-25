using Core.Data;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Service.Services;
using System.Linq;
using System.Reflection;

namespace WebAPI.Admin.Configuration
{
    public static class InjectionConfiguration
    {
        public static void AddInjectionConfiguration(this IServiceCollection services)
        { 
            var serviceClasses = Assembly.GetAssembly(typeof(IAuthenticationService)) 
                .GetExportedTypes()
                .Where(x => x.Name.EndsWith("Service"))
                .Where(x => !x.IsInterface)
                .ToList();

            var repositoryClasses = Assembly.GetAssembly(typeof(IUserRepository))
                .GetExportedTypes()
                .Where(x => x.Name.EndsWith("Repository"))
                .Where(x => !x.IsInterface)
                .ToList();

            foreach (var serviceClass in serviceClasses)
            {
                var serviceInterface = serviceClass.GetInterfaces().Where(x => x.Name == "I" + serviceClass.Name).FirstOrDefault();

                if(serviceInterface != null)
                {
                    services.Add(new ServiceDescriptor(serviceInterface, serviceClass, ServiceLifetime.Scoped));
                }
            }

            foreach (var repositoryClass in repositoryClasses)
            {
                var repositoryInterface = repositoryClass.GetInterfaces().Where(x => x.Name == "I" + repositoryClass.Name).FirstOrDefault();

                if (repositoryInterface != null)
                {
                    services.Add(new ServiceDescriptor(repositoryInterface, repositoryClass, ServiceLifetime.Scoped));
                }
            }

            services.Add(new ServiceDescriptor(typeof(IUnitOfWork), typeof(UnitOfWork), ServiceLifetime.Scoped));
            services.Add(new ServiceDescriptor(typeof(IDatabaseFactory), typeof(DatabaseFactory), ServiceLifetime.Scoped));
            services.Add(new ServiceDescriptor(typeof(DbContext), typeof(ResellTicketDbContext), ServiceLifetime.Scoped));
            services.Add(new ServiceDescriptor(typeof(UserManager<User>), typeof(UserManager<User>), ServiceLifetime.Scoped));
        }
    }
}
