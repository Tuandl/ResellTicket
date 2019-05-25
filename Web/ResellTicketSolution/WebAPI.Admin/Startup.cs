using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Cors.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ViewModel.AppSetting;
using WebAPI.Admin.Configuration;
using WebAPI.Admin.Configuration.Authorization;

namespace WebAPI.Admin
{
    public class Startup
    {
        private const string CONFIG_AUTH_SETTING = "AuthSetting";

        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration) 
        {
            Configuration = configuration; //Khởi tạo 1 configuration để lấy các config trong 
                                           //appsetting.Development.json
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services) //chạy đầu tiên sao khi khởi tạo contructor
        {
            //Configuration for inject configuration into controller
            //Lấy AuthSetting trong appsetting.Development.json map vs class AuthSetting 
            //rồi set global cho Application
            services.Configure<AuthSetting>(Configuration.GetSection(CONFIG_AUTH_SETTING));

            //set local 
            var authSetting = Configuration.GetSection(CONFIG_AUTH_SETTING).Get<AuthSetting>();

            //Add EntityFramework Configuration
            services.AddEntityFrameworkConfiguration(Configuration);

            //Add Identity Configuration
            services.AddIdentityConfiguration(authSetting);

            //Add Injection Configuration
            services.AddInjectionConfiguration();

            //Cho phép trình duyệt chập nhận với mọi domain khác gọi api ở domain của mình
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAnyOrigins", builder => builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod().AllowCredentials());
            });

            //Add Swagger
            services.AddDocumentationConfiguration();

            services.AddAutoMapperConfiguration();

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.Configure<MvcOptions>(options =>
            {
                options.Filters.Add(new CorsAuthorizationFilterFactory("AllowAnyOrigins"));
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            //if (env.IsDevelopment())
            //{
            app.UseDeveloperExceptionPage();
            //}

            app.UseCors("AllowAnyOrigins");
            app.UseAuthentication();
            app.UseMvc();

            app.UseSwagger();
            app.UseSwaggerUI(options => { 
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "Resell Ticket Admin");   
                //options.RoutePrefix = string.Empty;
            });
        }
    }
}
