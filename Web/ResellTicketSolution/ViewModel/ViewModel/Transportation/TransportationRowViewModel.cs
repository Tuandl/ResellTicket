using System;
using System.Collections.Generic;
using System.Text;
using Core.Models;

namespace ViewModel.ViewModel.Transportation
{
    public class TransportationRowViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public int VehicleId { get; set; }
        public string VehicleName { get; set; }
        public int ExpiredBefore { get; set; }
    }
}
