using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using ViewModel.AppSetting;

namespace Service.SMSService
{
    public class StringeeSMSService : ISmsService
    {
        private const int EXPIRED_MIN = 30;
        private const string API_URL = "https://api.stringee.com/v1/sms";

        private readonly IOptions<StringeeSetting> SETTING;

        public StringeeSMSService(
                IOptions<StringeeSetting> options
            )
        {
            SETTING = options;
        }

        public string SendSMS(string message, string phoneNumber)
        {
            throw new NotSupportedException();
        }

        public string BuildJWTTokenForStringee()
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Jti, $"{SETTING.Value.APIKeySID}-{Guid.NewGuid().ToString()}"),
                new Claim("rest_api", "true"),
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SETTING.Value.APIKeySecret));
            var crediential = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: SETTING.Value.APIKeySID,
                claims: claims,
                expires: DateTime.Now.AddMinutes(EXPIRED_MIN),
                signingCredentials: crediential
            );

            token.Header.Add("cty", "stringee-api;v=1");

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string SendOTP(string OTPCode, string phoneNumber)
        {
            try
            {
                var data = new
                {
                    sms = new[] {
                        new {
                            from = SETTING.Value.FromName,
                            to = phoneNumber,
                            text = new {
                                template = "5692",
                                @params = new [] { "", OTPCode },
                            },
                        },
                    },
                };
                var dataJson = Newtonsoft.Json.JsonConvert.SerializeObject(data);

                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Add("X-STRINGEE-AUTH", BuildJWTTokenForStringee());

                    var response = client.PostAsync(
                        API_URL,
                        new StringContent(dataJson, Encoding.UTF8, "application/json")
                    ).Result;
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

            return string.Empty;
        }
    }
}
