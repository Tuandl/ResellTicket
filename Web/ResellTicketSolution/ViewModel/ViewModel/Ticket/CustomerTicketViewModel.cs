using Core.Enum;
using System;
using System.Collections.Generic;
using System.Text;

namespace ViewModel.ViewModel.Ticket
{
    public class CustomerTicketViewModel
    {
        public int Id { get; set; }
        public string TicketCode { get; set; }
        public string DepartureCity { get; set; }
        public int DepartureStationId { get; set; }
        public string ArrivalCity { get; set; }
        public int ArrivalStationId { get; set; }
        public string Vehicle { get; set; }
        public int TransportationId { get; set; }
        public int TicketTypeId { get; set; }
        public DateTime DepartureDateTime { get; set; }
        public DateTime ArrivalDateTime { get; set; }
        public decimal SellingPrice { get; set; }
        public TicketStatus Status { get; set; }
    }
}
