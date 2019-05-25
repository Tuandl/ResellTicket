using Core.Data;
using Core.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace WebAPI.Admin.Configuration
{
    public static class EntityFrameworkConfiguration
    {
        public static void AddEntityFrameworkConfiguration(this IServiceCollection services, IConfiguration configuration)
        {
            //Lấy chuỗi connection từ appsetting.Development.json
            var connectionString = configuration.GetConnectionString(DatabaseFactory.CONNECTION_NAME);

            //Đăng ký 1 cái contextDb(dùng để xử lý mấy cái connect vô db) 
            //Để khi nào cần thì gọi ra
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
