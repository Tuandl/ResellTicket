﻿namespace ViewModel.AppSetting
{
    public class AuthSetting
    {
        public string Secret { get; set; }

        public string Issuer { get; set; }

        public string Audience { get; set; }

        public int AccessExpiration { get; set; }

        public int RefreshExpiration { get; set; }

        public string DefaultPassword { get; set; }
    }
}
