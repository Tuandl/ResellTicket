using Core.Enum;
using System;

namespace ViewModel.ViewModel.Route
{
    public class RouteRowViewModel
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public decimal TotalAmount { get; set; }
        public RouteStatus Status { get; set; }
        public int CustomerId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string DepartureCityName { get; set; }
        public string ArrivalCityName { get; set; }
        public int TicketQuantity { get; set; }
        public DateTime DepartureDate { get; set; }
        public DateTime ArrivalDate { get; set; }
        public bool IsValid { get; set; }
        public bool IsLiability { get; set; }
        public ResolveOption? ResolveOption { get; set; }
    }
}
