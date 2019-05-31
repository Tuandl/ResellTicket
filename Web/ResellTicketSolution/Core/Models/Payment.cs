using Core.Infrastructure;

namespace Core.Models
{
    public class Payment : EntityBase
    {
        public int CreditCartId { get; set; }
        public int RouteId { get; set; }
        public int TourId { get; set; }
        public decimal Amount { get; set; }
        public decimal FeeAmount { get; set; }
        public int Status { get; set; }
    }
}
