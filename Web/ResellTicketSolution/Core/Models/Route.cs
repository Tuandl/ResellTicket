using System.Collections;
using System.Collections.Generic;
using Core.Infrastructure;

namespace Core.Models
{
    public class Route : EntityBase
    {
        public string Code { get; set; }
        public decimal TotalAmount { get; set; }
        public int Status { get; set; }
        public int CustomerId { get; set; }
        public virtual Customer Customer { get; set; }
        public virtual ICollection<RouteTicket> RouteTickets { get; set; }
        public virtual ICollection<Payment> Payments { get; set; }

    }
}
