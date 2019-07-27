using System;
using System.Collections.Generic;
using System.Text;

namespace ViewModel.AppSetting
{
    public class SendGridSetting
    {
        public string SendGridKey { get; set; }
        public string FromEmail { get; set; }
        public string FromName { get; set; }
        public string Title { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string AddressNumber { get; set; }
        public string PhoneNumber { get; set; }
        public string BussinessNumber { get; set; }
        public string Term { get; set; }
        public string RefundTitle { get; set; }
        public string ReplacementTitle { get; set; }
    }
}
