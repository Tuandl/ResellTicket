using System;
using System.Collections.Generic;
using System.Text;

namespace ViewModel.ViewModel.Customer
{
    public class CustomerChangePasswordViewModel
    {
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string NewPassword { get; set; }
    }
}
