using Core.Enum;
using System;
using System.Collections.Generic;
using System.Text;

namespace ViewModel.ViewModel.Payment
{
    public class PaymentCreateViewModel
    {
        public int CreditCartId { get; set; }
        public int? RouteId { get; set; }
        public int? TourId { get; set; }
        public string StripeChargeId { get; set; }
        public decimal Amount { get; set; }
        public decimal FeeAmount { get; set; }
        public PaymentStatus Status { get; set; }
    }
}
