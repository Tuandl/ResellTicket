using Core.Enum;
using Core.Infrastructure;

namespace Core.Models
{
    public class RouteTicket : EntityBase
    {
        public int RouteId { get; set; }
        public int TicketId { get; set; }
        public int DepartureStationId { get; set; }
        public int ArrivalStationId { get; set; }
        public int Order { get; set; }
        //public ResolveOption? ResolveOrder { get; set; }
        public virtual Ticket Ticket { get; set; }
        public virtual Station DepartureStation { get; set; }
        public virtual Station ArrivalStation { get; set; }
        public virtual Route Route { get; set; }
    }
}
