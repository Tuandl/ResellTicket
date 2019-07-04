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
        public string DepartureCityName { get; set; }
        public string ArrivalCityName { get; set; }
        public string Vehicle { get; set; }
        public DateTime DepartureDateTime { get; set; }
        public DateTime ArrivalDateTime { get; set; }
        public DateTime ExpiredDateTime { get; set; }
        public TicketStatus Status { get; set; }
        public decimal SellingPrice { get; set; }

    }
}
