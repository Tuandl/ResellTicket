using Core.Enum;
using System;
using System.Collections.Generic;
using System.Text;

namespace ViewModel.ViewModel.Ticket
{
    public class TicketDetailViewModel
    {
        public int Id { get; set; }
        
        public int VehicleId { get; set; }
        public int TransportationId { get; set; }
        public int TicketTypeId { get; set; }
        public int DepartureCityId { get; set; }
        public int DepartureStationId { get; set; }
        public int ArrivalCityId { get; set; }
        public int ArrivalStationId { get; set; }

        public string TicketCode { get; set; }
        public string VehicleName { get; set; }
        public string TransportationName { get; set; }
        public string TicketTypeName { get; set; }
        public string DepartureCityName { get; set; }
        public string DepartureStationName { get; set; }
        public DateTime DepartureDateTime { get; set; }
        public string ArrivalCityName { get; set; }
        public string ArrivalStationName { get; set; }
        public DateTime ArrivalDateTime { get; set; }
        public string Description { get; set; }
        public TicketStatus Status { get; set; }
        public string PassengerName { get; set; }
        public string EmailBooking { get; set; }
        public decimal SellingPrice { get; set; }
        public string SellerPhone { get; set; }
        public int ExpiredBefore { get; set; }
        public DateTime ExpiredDateTime { get; set; }

        public bool? IsTicketCodeValid { get; set; }
        public bool? IsVehicleValid { get; set; }
        public bool? IsTransportationValid { get; set; }
        public bool? IsDepartureValid { get; set; }
        public bool? IsArrivalValid { get; set; }
        public bool? IsTicketTypeValid { get; set; }
        public bool? IsPassengerNameValid { get; set; }
        public bool? IsEmailBookingValid { get; set; }
        public string BuyerPassengerIdentify { get; set; }
        public string BuyerPassengerName { get; set; }
        public string BuyerPassengerEmail { get; set; }
        public string BuyerPassengerPhone { get; set; }



    }
}
