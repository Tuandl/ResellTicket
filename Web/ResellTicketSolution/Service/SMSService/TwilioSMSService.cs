using Microsoft.Extensions.Options;
using System;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using ViewModel.AppSetting;

namespace Service.SMSService
{
    public class TwilioSMSService : ISmsService
    {
        private const string OTP_TEMPLATE = "Resell Ticket transaction code {0}. This code will be available within the next 2 minutes.";
        private readonly TwilioSetting SETTING;

        public TwilioSMSService(IOptions<TwilioSetting> settings)
        {
            //Inject Appsetting from appsettings.json
            SETTING = settings.Value;
        }

        public string SendOTP(string OTP, string phoneNumber)
        {
            return SendSMS(string.Format(OTP_TEMPLATE, OTP), phoneNumber);
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
