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
    }
}
