using System;
using System.Collections.Generic;
using System.Text;

namespace ViewModel.ViewModel.Transportation
{
    public class TransportationCreateViewModel
    {
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public int VehicleId { get; set; }
        public int ExpiredBefore { get; set; }
    }
}
