using Core.Enum;
using System.Collections.Generic;
using ViewModel.ViewModel.ResolveOptionLog;

namespace ViewModel.ViewModel.Route
{
    public class RouteDetailViewModel
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public decimal TotalAmount { get; set; }
        public RouteStatus Status { get; set; }
        public decimal EarnedLoss { get; set; }
        public int CustomerId { get; set; }
        public bool IsRefundAll { get; set; }
        public string BuyerName { get; set; }
        public string BuyerPhone { get; set; }
        public List<RouteTicketDetailViewModel> RouteTickets { get; set; }
        public List<ResolveOptionLogViewModel> ResolveOptionLogs { get; set; }
    }
}
