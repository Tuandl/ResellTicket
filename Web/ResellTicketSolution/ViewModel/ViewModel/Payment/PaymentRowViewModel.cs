using System;
using System.Collections.Generic;
using System.Text;

namespace ViewModel.ViewModel.Payment
{
    public class PaymentRowViewModel
    {
        public int Id { get; set; }
        public int? RouteId { get; set; }
        public int? TourId { get; set; }
        public decimal Amount { get; set; }
        public string StripeChargeId { get; set; }
    }
}
