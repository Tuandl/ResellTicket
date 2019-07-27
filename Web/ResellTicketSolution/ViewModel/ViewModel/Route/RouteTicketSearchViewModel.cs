using System;

namespace ViewModel.ViewModel.Route
{
    public class RouteTicketSearchViewModel
    {
        public int TicketId { get; set; }
        public int DepartureCityId { get; set; }
        public string DepartureCityName { get; set; }
        public int DepartureStationId { get; set; }
        public string DepartureStationName { get; set; }
        public DateTime DepartureDateTime { get; set; }
        public DateTime? ExpiredDateTime { get; set; }
        public int ArrivalCityId { get; set; }
        public string ArrivalCityName { get; set; }
        public int ArrivalStationId { get; set; }
        public string ArrivalStationName { get; set; }
        public DateTime ArrivalDateTime { get; set; }

        public string VehicleName { get; set; }
        public string TransportationName { get; set; }
        public int Order { get; set; }

        public DateTime? ExpiredDate { get; set; }
    }
}
