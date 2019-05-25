using System;

namespace Core.Models
{
    public class Ticket
    {
        public string TicketCode { get; set; }

        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
