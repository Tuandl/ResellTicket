using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.PlatformAbstractions;
using Swashbuckle.AspNetCore.Swagger;
using System.Collections.Generic;
using System.IO;

namespace WebAPI.Configuration
{
    public static class DocumentationConfiguration
    {
        public static void AddDocumentationConfiguration(this IServiceCollection services)
        {
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new Swashbuckle.AspNetCore.Swagger.Info()
                {
                    Version = "v1",
                    Title = "Resell Ticket Customer API",
                    Description = "API Documentation for Resell Ticket Customer API",
                    TermsOfService = "None",
                    Contact = new Contact
                    {
                        Name = "FPTU",
                        Email = string.Empty,
                        Url = "http://fpt.edu.vn/"
                    },
                    License = new License
                    {
                        Name = "Use under FPTU",
                        Url = "http://fpt.edu.vn/"
                    }
                });

                var security = new Dictionary<string, IEnumerable<string>>
                {
                    {"Bearer",new string[] {} }
                };
                options.AddSecurityRequirement(security);
                options.AddSecurityDefinition("Bearer", new ApiKeyScheme()
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = "header",
                    Type = "apiKey",
                });

                var xmlDocPath = PlatformServices.Default.Application.ApplicationBasePath;
                var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";

                options.IncludeXmlComments(Path.Combine(xmlDocPath, xmlFile));
            });
        }
    }
}
