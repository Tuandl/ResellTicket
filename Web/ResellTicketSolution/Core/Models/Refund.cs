using Core.Enum;
using Core.Infrastructure;

namespace Core.Models
{
    public class Refund : EntityBase
    {
        public int PaymentId { get; set; }
        public decimal Amount { get; set; }
        public string StripeRefundId { get; set; }
        public string Description { get; set; }
        public RefundStatus Status { get; set; }
        public virtual  Payment Payment { get; set; }

    }
}
