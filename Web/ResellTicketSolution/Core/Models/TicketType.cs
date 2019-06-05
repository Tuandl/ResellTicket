using System;
using System.Collections.Generic;
using System.Text;
using Core.Infrastructure;

namespace Core.Models
{
    public class TicketType : EntityBase
    {
        public string Name { get; set; }
        public int VehicleId { get; set; }
        public virtual Vehicle Vehicle { get; set; }
        public virtual ICollection<Ticket> Tickets { get; set; }
    }
}
