using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Cors.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ViewModel.AppSetting;
using WebAPI.Configuration;
using WebAPI.Configuration.Authorization;

namespace WebAPI
{
    //Test azure pipeline 2
    public class Startup
    {
        private const string CONFIG_AUTH_SETTING = "AuthSetting";
        private const string CONFIG_TWILIO_SETTING = "TwilioSetting";
        private const string CONFIG_STRINGEE_SETTING = "StringeeSetting";
        private const string CONFIG_CREDITCARD_SETTING = "CrediCardSetting";
        private const string CONFIG_ONESIGNAL_SETTING = "OneSignalSetting";
        private const string CONFIG_SENDGRID_SETTING = "SendGridSetting";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //Configuration for inject configuration into controller
            services.Configure<AuthSetting>(Configuration.GetSection(CONFIG_AUTH_SETTING));
            services.Configure<TwilioSetting>(Configuration.GetSection(CONFIG_TWILIO_SETTING));
            services.Configure<StringeeSetting>(Configuration.GetSection(CONFIG_STRINGEE_SETTING));
            services.Configure<CrediCardSetting>(Configuration.GetSection(CONFIG_CREDITCARD_SETTING));
            services.Configure<OneSignalSetting>(Configuration.GetSection(CONFIG_ONESIGNAL_SETTING));
            services.Configure<SendGridSetting>(Configuration.GetSection(CONFIG_SENDGRID_SETTING));
            var authSetting = Configuration.GetSection(CONFIG_AUTH_SETTING).Get<AuthSetting>();

            //Add EntityFramework Configuration
            services.AddEntityFrameworkConfiguration(Configuration);

            //Add Identity Configuration
            services.AddIdentityConfiguration(authSetting);

            //Add Injection Configuration
            services.AddInjectionConfiguration();

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
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "Resell Ticket Customer");
                //options.RoutePrefix = string.Empty;
            });
        }
    }
}
