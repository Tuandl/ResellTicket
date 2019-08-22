using System;

namespace ViewModel.ViewModel.Route
{
    public class SearchRouteParamViewModel
    {
        public int DepartureCityId { get; set; }
        public int ArrivalCityId { get; set; }
        public int MaxTicketCombination { get; set; }
        public DateTime DepartureDate { get; set; }
        public DateTime ArrivalDate { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int[] VehicleIds { get; set; }
        public int[] TransportationIds { get; set; }
        public int[] TicketTypeIds { get; set; }
        public int MaxWaitingHours { get; set; }
        public SearchRouteOrderByEnum OrderBy { get; set; } = SearchRouteOrderByEnum.Price;
    }
}
