using System;
using System.Collections.Generic;
using System.Text;
using Core.Infrastructure;

namespace Core.Models
{
    public class OTP : EntityBase
    {
        public string PhoneNo { get; set; }
        public string Code { get; set; }
        public DateTime ExpiredAt { get; set; }
    }
}
