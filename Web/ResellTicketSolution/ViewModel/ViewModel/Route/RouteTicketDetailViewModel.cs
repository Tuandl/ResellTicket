using Core.Enum;
using System;

namespace ViewModel.ViewModel.Route
{
    public class RouteTicketDetailViewModel
    {
        public int Id { get; set; }
        public string TicketCode { get; set; }
        public int TransportationId { get; set; }
        public string TransportationName { get; set; }
        public int DepartureStationId { get; set; }
        public string DepartureStationName { get; set; }
        public string DepartureCityName { get; set; }
        public int ArrivalStationId { get; set; }
        public string ArrivalStationName { get; set; }
        public string ArrivalCityName { get; set; }
        public TicketStatus Status { get; set; }
        public decimal SellingPrice { get; set; }
        public string Description { get; set; }
        public decimal CommissionPercent { get; set; }
        public DateTime DepartureDateTime { get; set; }
        public DateTime ArrivalDateTime { get; set; }
        public int TicketTypeId { get; set; }
        public string TicketTypeName { get; set; }
        public string VehicleName { get; set; }
        public int Order { get; set; }
    }
}
