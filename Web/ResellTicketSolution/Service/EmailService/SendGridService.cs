using Microsoft.Extensions.Options;
using ViewModel.AppSetting;
using SendGrid;
using SendGrid.Helpers.Mail;
using Core.Repository;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace Service.EmailService
{
    public interface ISendGridService
    {
        void SendEmailReceiptForBuyer(string username);
    }
    public class SendGridService : ISendGridService
    {
        private readonly IOptions<SendGridSetting> SETTING;
        private readonly ICustomerRepository _customerRepository;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IRouteRepository _routeRepository;
        public SendGridService(IOptions<SendGridSetting> options, ICustomerRepository customerRepository, IHostingEnvironment hostingEnvironment, IRouteRepository routeRepository)
        {
            SETTING = options;
            _customerRepository = customerRepository;
            _hostingEnvironment = hostingEnvironment;
            _routeRepository = routeRepository;
        }

        public void SendEmailReceiptForBuyer(string username)
        {
            var apiKey = SETTING.Value.SendGridKey;
            var client = new SendGridClient(apiKey);
            string emailTemplateHtml = _hostingEnvironment.ContentRootPath + "\\EmailTemplate\\EmailTemplate.html";
            string body = string.Empty;
            //using streamreader for reading my htmltemplate   

            using (StreamReader reader = new StreamReader(emailTemplateHtml))
            {
                body = reader.ReadToEnd();
            }
            var customerEmail = _customerRepository.Get(c => c.Username == username).Email;
            var customerFullName = _customerRepository.Get(c => c.Username == username).FullName;
            var customerPhoneNumber = _customerRepository.Get(c => c.Username == username).PhoneNumber;
            var customerId = _customerRepository.Get(c => c.Username == username).Id;
            body = body.Replace("{customerFullName}", customerFullName); //replacing the required things  
            body = body.Replace("{customerEmail}", customerEmail);
            body = body.Replace("{customerPhoneNumber}", customerPhoneNumber);

            body = body.Replace("{Title}", SETTING.Value.Title);
            body = body.Replace("{fromName}", SETTING.Value.FromName);
            body = body.Replace("{fromEmail}", SETTING.Value.FromEmail);
            body = body.Replace("{Street}", SETTING.Value.Street);
            body = body.Replace("{City}", SETTING.Value.City);
            body = body.Replace("{addressNumber}", SETTING.Value.AddressNumber);
            body = body.Replace("{phoneNumber}", SETTING.Value.PhoneNumber);
            body = body.Replace("{bussinessNumber}", SETTING.Value.BussinessNumber);
            var from = new EmailAddress(SETTING.Value.FromEmail, SETTING.Value.FromName);
            var customerRoute = _routeRepository.Get(r => r.CustomerId == customerId).Code;
            var subject = customerRoute;
            
            var to = new EmailAddress(customerEmail, customerFullName);
            var plainTextContent = "Hi!" + customerFullName + ",";
            var htmlContent = body;
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            client.SendEmailAsync(msg);
        }
    }
}
