using Core.Infrastructure;
using System;
using System.Collections;
using System.Collections.Generic;
using Core.Enum;

namespace Core.Models
{
    public class Ticket : EntityBase
    {
        public string TicketCode { get; set; }
        public int TransportationId { get; set; }
        public int DepartureId { get; set; }
        public int ArrivalId { get; set; }
        public TicketStatus Status { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public decimal CommissionPercent { get; set; }
        public DateTime DepartureDate { get; set; }
        public DateTime ArrivalDate { get; set; }
        public int TicketTypeId { get; set; }
        public virtual TicketType TicketType { get; set; }
        public int CustomerId { get; set; }
        public virtual Customer Customer { get; set; }
        public virtual Transportation Transportation { get; set; }
        public virtual Station Departure { get; set; }
        public virtual Station Arrival { get; set; }
        public virtual ICollection<Payout> Payouts { get; set; }
        public virtual ICollection<RouteTicket> RouteTickets { get; set; }
    }
}
