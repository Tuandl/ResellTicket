using System;
using System.Collections.Generic;
using System.Text;
using Core.Enum;

namespace ViewModel.ViewModel.Ticket
{
    public class TicketRowViewModel
    {
        public int id { get; set; }
        public string TicketCode { get; set; }
        public DateTime DepartureDate { get; set; }
        public DateTime ArrivalDate { get; set; }
        public decimal Price { get; set; }
        public TicketStatus Status { get; set; }
        public string SellerPhone { get; set; }
        public decimal FeeAmount { get; set; }
        public int CustomerId { get; set; }
    }
}
