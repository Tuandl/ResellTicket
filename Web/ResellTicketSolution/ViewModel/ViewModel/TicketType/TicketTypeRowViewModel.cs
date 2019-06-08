using System;
using System.Collections.Generic;
using System.Text;

namespace ViewModel.ViewModel.TicketType
{
    public class TicketTypeRowViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int VehicleId { get; set; }
        public string VehicleName { get; set; }
    }
}
