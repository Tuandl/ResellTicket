using Core.Enum;
using Core.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Models
{
    public class CustomerDevice : EntityBase
    {
        public string DeviceId { get; set; }
        public bool IsLogout { get; set; }
        public virtual Customer Customer { get; set; }
        public int CustomerId { get; set; }
    }
}
