﻿using System;
using System.Collections.Generic;
using System.Text;

namespace ViewModel.ViewModel.Customer
{
    public class CustomerRowViewModel
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string StripeConnectAccountId { get; set; }
        public string StripeId { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
    }
}
