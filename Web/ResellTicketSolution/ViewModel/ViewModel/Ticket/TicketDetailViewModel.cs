using System;
using System.Collections.Generic;
using System.Text;

namespace ViewModel.ViewModel.Ticket
{
    public class TicketDetailViewModel
    {
        public int Id { get; set; }
        public string TicketCode { get; set; }
        public int VehicleId { get; set; }
        public string VehicleName { get; set; }
        public string TransportationName { get; set; }
        public string DepartureCityName { get; set; }
        public string DepartureStationName { get; set; }
        public string ArrivalCityName { get; set; }
        public string ArrivalStationName { get; set; }
        public decimal SellingPrice { get; set; }
        public string Description { get; set; }
        public DateTime DepartureDateTime { get; set; }
        public DateTime ArrivalDateTime { get; set; }
        public string TicketTypeName { get; set; }
    }
}
