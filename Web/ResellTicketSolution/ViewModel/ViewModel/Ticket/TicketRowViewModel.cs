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
        public DateTime DepartureDateTime { get; set; }
        public DateTime ArrivalDateTime { get; set; }
        public decimal SellingPrice { get; set; }
        public TicketStatus Status { get; set; }
        public string SellerPhone { get; set; }
        public decimal FeeAmount { get; set; }
        public int CustomerId { get; set; }
    }
}
