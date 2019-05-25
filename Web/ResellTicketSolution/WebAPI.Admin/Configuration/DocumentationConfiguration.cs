using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.PlatformAbstractions;
using Swashbuckle.AspNetCore.Swagger;
using System.Collections.Generic;
using System.IO;
using System.Reflection;

namespace WebAPI.Admin.Configuration
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
                    Title = "Resell Ticket Admin API",
                    Description = "API Documentation for Resell Ticket Admin API",
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
                }); //để test, cho phép thêm header để thêm token string vào

                //Để chỉ ra đường dẫn swagger lấy ra file document ở đâu rồi render ra swaggerUI
                var xmlDocPath = PlatformServices.Default.Application.ApplicationBasePath;
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";

                options.IncludeXmlComments(Path.Combine(xmlDocPath, xmlFile));
            });
        }
    }
}
