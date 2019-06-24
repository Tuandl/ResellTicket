using System;
using System.Collections.Generic;
using System.Text;

namespace ViewModel.ViewModel.Authentication
{
    public class LoginReturnViewModel
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Token { get; set; }
        public string PhoneNumber { get; set; }
    }
}
