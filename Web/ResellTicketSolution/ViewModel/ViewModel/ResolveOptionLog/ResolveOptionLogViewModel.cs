using Core.Enum;
using System;
using System.Collections.Generic;
using System.Text;

namespace ViewModel.ViewModel.ResolveOptionLog
{
    public class ResolveOptionLogViewModel
    {
        public string ResolvedTicketCode { get; set; }
        public string ReplacedTicketCode { get; set; }
        public string StaffName { get; set; }
        public DateTime ResolveAt { get; set; }
        public ResolveOption Option { get; set; }
        public string DepartureCityName { get; set; }
        public DateTime DepartureDateTime { get; set; }
        public string ArrivalCityName { get; set; }
        public DateTime ArrivalDateTime { get; set; }
        public decimal SellingPrice { get; set; }

    }
}
