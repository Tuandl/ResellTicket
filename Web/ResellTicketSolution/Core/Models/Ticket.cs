using Core.Infrastructure;
using System;
using Core.Enum;

namespace Core.Models
{
    public class Ticket : EntityBase    
    {
        public string TicketCode { get; set; }
        
        public int TransportationId { get; set; }

        public int DepartureId { get; set; }

        public int DestinationId { get; set; }

        public TicketStatus Status { get; set; }

        public decimal Price { get; set; }

        public string Description { get; set; }

        public decimal CommissionPercent { get; set; }

        public DateTime DepartureDate { get; set; }

        public DateTime ArrivalDate { get; set; }

        public int CustomerId { get; set; }

        public virtual Customer Customer { get; set; }
    }
}
