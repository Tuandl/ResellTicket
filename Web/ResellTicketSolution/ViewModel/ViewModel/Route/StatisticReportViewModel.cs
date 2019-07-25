using System;
using System.Collections.Generic;
using System.Text;

namespace ViewModel.ViewModel.Route
{
    public class StatisticReportViewModel
    {
        public int AvailableTicketCount { get; set; }
        public int CompletedTicketCount { get; set; }
        public int CompletedRouteCount { get; set; }
        public decimal BalanceAccount { get; set; }
    }
}
