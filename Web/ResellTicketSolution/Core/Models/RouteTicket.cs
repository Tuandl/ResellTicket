using Core.Infrastructure;

namespace Core.Models
{
    public class RouteTicket : EntityBase
    {
        public int Id { get; set; }

        public int RouteId { get; set; }

        public int TicketId { get; set; }

        public int DepartureId { get; set; }

        public int DestinationID { get; set; }

        public int Order { get; set; }
    }
}
