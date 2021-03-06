﻿using Core.Data;
using Core.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace WebAPI.Configuration
{
    public static class EntityFrameworkConfiguration
    {
        public static void AddEntityFrameworkConfiguration(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString(DatabaseFactory.CONNECTION_NAME);

            services.AddDbContext<ResellTicketDbContext>(options =>
            {
                options.UseSqlServer(
                    connectionString
                );
            });

            var serviceProvider = services.BuildServiceProvider();
            var optionBuilder = new DbContextOptionsBuilder();
            optionBuilder.UseSqlServer(connectionString);

            using (var context = serviceProvider.GetService<ResellTicketDbContext>())
            {
                context.Database.Migrate();
            }
        }
    }
}
