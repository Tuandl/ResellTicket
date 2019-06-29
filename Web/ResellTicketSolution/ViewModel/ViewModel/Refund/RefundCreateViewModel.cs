using Core.Enum;
using System;
using System.Collections.Generic;
using System.Text;

namespace ViewModel.ViewModel.Refund
{
    public class RefundCreateViewModel
    {
        public int PaymentId { get; set; }
        public decimal Amount { get; set; }
        public string StripeRefundId { get; set; }
        public RefundStatus Status { get; set; }
    }
}
