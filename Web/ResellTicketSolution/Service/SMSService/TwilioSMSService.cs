using Microsoft.Extensions.Options;
using System;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using ViewModel.AppSetting;

namespace Service.SMSService
{
    public class TwilioSMSService : ISmsService
    {
        private readonly TwilioSetting SETTING;

        public TwilioSMSService(IOptions<TwilioSetting> settings)
        {
            //Inject Appsetting from appsettings.json
            SETTING = settings.Value;
        }

        public string SendSMS(string message, string phoneNumber)
        {
            if(string.IsNullOrEmpty(message) || string.IsNullOrEmpty(phoneNumber))
            {
                return string.Empty;
            }
            try
            {
                TwilioClient.Init(SETTING.AccountSID, SETTING.AuthToken);
                var messageResponse = MessageResource.Create(
                    body: message,
                    messagingServiceSid: SETTING.MessageServiceId,
                    to: new Twilio.Types.PhoneNumber(phoneNumber)
                );
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

            return string.Empty;
        }
    }
}
