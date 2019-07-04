using System.Collections;
using System.Collections.Generic;
using Core.Infrastructure;

namespace Core.Models
{
    public class Transportation : EntityBase
    {
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public int VehicleId { get; set; }
        public int ExpiredBefore { get; set; }
        public virtual Vehicle Vehicle { get; set; }
        public virtual ICollection<Ticket> Tickets { get; set; } 

    }
}
