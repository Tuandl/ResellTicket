using System.Collections.Generic;
using Core.Infrastructure;

namespace Core.Models
{
    public class Vehicle : EntityBase
    {
        public string Name { get; set; }
        public virtual ICollection<Transportation> Transportations { get; set; }
        public virtual ICollection<TicketType> TicketTypes { get; set; }

    }
}
