using Core.Enum;
using Core.Infrastructure;
using System.Collections.Generic;

namespace Core.Models
{
    public class Route : EntityBase
    {
        public string Code { get; set; }
        public decimal TotalAmount { get; set; }
        public RouteStatus Status { get; set; }
        //public ResolveOption? ResolveOption { get; set; }
        public int CustomerId { get; set; }
        public bool IsRefundAll { get; set; }
        public virtual Customer Customer { get; set; }
        public virtual ICollection<RouteTicket> RouteTickets { get; set; }
        public virtual ICollection<Payment> Payments { get; set; }
        public virtual ICollection<ResolveOptionLog> ResolveOptionLogs { get; set; }

    }
}
