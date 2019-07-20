using System.Collections;
using System.Collections.Generic;
using Core.Infrastructure;

namespace Core.Models
{
    public class Station : EntityBase
    {
        public int CityId { get; set; }
        public string Name { get; set; }
        public virtual City City { get; set; }
        public virtual ICollection<Ticket> ArrivalTickets { get; set; }
        public virtual ICollection<Ticket> DepartureTickets { get; set; }
        public virtual ICollection<RouteTicket> DepartureRouteTickets { get; set; }
        public virtual ICollection<RouteTicket> ArrivalRouteTickets { get; set; }

    }
}
