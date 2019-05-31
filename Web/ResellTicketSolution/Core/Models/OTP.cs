using Core.Infrastructure;
using System;

namespace Core.Models
{
    public class OTP : EntityBase
    {
        public string PhoneNo { get; set; }
        public string Code { get; set; }
        public DateTime ExpiredAt { get; set; }
    }
}
