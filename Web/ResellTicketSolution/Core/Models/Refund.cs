using Core.Infrastructure;

namespace Core.Models
{
    public class Refund : EntityBase
    {
        public int PaymentId { get; set; }
        public decimal Amount { get; set; }
        public int Status { get; set; }

    }
}
