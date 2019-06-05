using Core.Infrastructure;

namespace Core.Models
{
    public class RouteTicket : EntityBase
    {
        public int RouteId { get; set; }
        public int TicketId { get; set; }
        public int DepartureId { get; set; }
        public int ArrivalId { get; set; }
        public int Order { get; set; }
        public virtual Ticket Ticket { get; set; }
        public virtual Station Departure { get; set; }
        public virtual Station Arrival { get; set; }
        public virtual Route Route { get; set; }
    }
}
