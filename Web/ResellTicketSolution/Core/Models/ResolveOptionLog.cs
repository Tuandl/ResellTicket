using Core.Enum;
using Core.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Models
{
    public class ResolveOptionLog : EntityBase
    {
        public ResolveOption Option { get; set; }
        public int RouteId { get; set; }
        public int TicketId { get; set; } //resolved
        public string ReplacedTicketCode { get; set; }
        public string StaffId { get; set; }
        public virtual Route Route { get; set; }
        public virtual Ticket ResolvedTicket { get; set; }
        public virtual User Staff { get; set; }
    }
}
