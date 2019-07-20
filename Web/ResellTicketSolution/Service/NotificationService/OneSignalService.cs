using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using ViewModel.AppSetting;
using Newtonsoft.Json;
using System.IO;

namespace Service.NotificationService
{
    public interface IOneSignalService
    {
        void PushNotificationCustomer(string message, List<string> deviceIds);
        void PushNotificationAdmin(string message, List<string> deviceIds);
    }
    public class OneSignalService : IOneSignalService
    {
        private readonly IOptions<OneSignalSetting> SETTING;
        private const string API_URL = "https://onesignal.com/api/v1/notifications";

        public OneSignalService(IOptions<OneSignalSetting> options)
        {
            SETTING = options;
        }

        public void PushNotificationCustomer(string message, List<string> deviceIds)
        {
            var obj = new
            {
                app_id = SETTING.Value.CustomerAppId,
                contents = new { en = message },
                include_player_ids = deviceIds
            };
            Push(obj);
        }

        public void PushNotificationAdmin(string message, List<string> deviceIds)
        {
            var obj = new
            {
                app_id = SETTING.Value.AdminAppId,
                contents = new { en = message },
                include_player_ids = deviceIds
            };
            Push(obj);
        }

        public void Push(object obj)
        {
            var request = WebRequest.Create(API_URL) as HttpWebRequest;
            request.KeepAlive = true;
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";

            var param = JsonConvert.SerializeObject(obj);
            byte[] byteArray = Encoding.UTF8.GetBytes(param);
            string responseContent = null;
            try
            {
                using (var writer = request.GetRequestStream())
                {
                    writer.Write(byteArray, 0, byteArray.Length);
                }
                using (var response = request.GetResponse() as HttpWebResponse)
                {
                    using (var reader = new StreamReader(response.GetResponseStream()))
                    {
                        responseContent = reader.ReadToEnd();
                    }
                }
            }
            catch (WebException ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.Message);
                System.Diagnostics.Debug.WriteLine(new StreamReader(ex.Response.GetResponseStream()).ReadToEnd());
            }
            //System.Diagnostics.Debug.WriteLine(responseContent);
        }
    }
}
