using System.Collections;
using System.Collections.Generic;
using Core.Enum;
using Core.Infrastructure;

namespace Core.Models
{
    public class Payment : EntityBase
    {
        public int CreditCartId { get; set; }
        public int? RouteId { get; set; }
        public int? TourId { get; set; }
        public decimal Amount { get; set; }
        public decimal FeeAmount { get; set; }
        public string StripeChargeId { get; set; }
        public PaymentStatus Status { get; set; }
        public virtual Route Route { get; set; }
        public virtual CreditCard CreditCard { get; set; }
        public virtual ICollection<Refund> Refunds { get; set; }
        public virtual ICollection<Payout> Payouts { get; set; }
    }
}
