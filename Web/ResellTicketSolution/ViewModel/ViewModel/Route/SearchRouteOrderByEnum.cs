namespace ViewModel.ViewModel.Route
{
    public enum SearchRouteOrderByEnum
    {
        /// <summary>
        /// Order by selling price ascending
        /// </summary>
        Price = 1,

        /// <summary>
        /// Order by total traveling of tickets in a route ascending
        /// </summary>
        TotalTravelingTime = 2,

        /// <summary>
        /// Order by arrival date of the last ticket in a route ascending
        /// </summary>
        ArrivalDate = 3,
    }
}
