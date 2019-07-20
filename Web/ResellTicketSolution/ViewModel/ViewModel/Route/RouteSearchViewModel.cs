using System.Collections.Generic;

namespace ViewModel.ViewModel.Route
{
    public class RouteSearchViewModel
    {
        public RouteSearchViewModel()
        {
            RouteTickets = new List<RouteTicketSearchViewModel>();
        }

        public decimal TotalAmount { get; set; }
        public List<RouteTicketSearchViewModel> RouteTickets { get; set; }
    }
}
