using Core.Infrastructure;
using System;

namespace Core.Models
{
    public class Ticket : EntityBase    
    {
        public string TicketCode { get; set; }
        
        public int Id { get; set; }

        //public DateTime CreatedAt { get; set; }

        public int TransportationId { get; set; }

        public int DepartureId { get; set; }

        public int DestinationId { get; set; }

        public string Code { get; set; }

        public decimal Price { get; set; }

        public string Description { get; set; }

        public decimal CommissionPercent { get; set; }

        public DateTime DepartureDate { get; set; }

        public DateTime ArrivalDate { get; set; }
    }
}
