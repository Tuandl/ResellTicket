using Core.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Models
{
    public class AdminDevice : EntityBase
    {
        public string DeviceId { get; set; }
        public bool IsLogout { get; set; }
        public virtual User User { get; set; }
        public string UserId { get; set; }
    }
}
