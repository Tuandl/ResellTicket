using Core.Infrastructure;

namespace Core.Models
{
    public class Route : EntityBase
    {
        public string Code { get; set; }
        public decimal TotalAmount { get; set; }
        public int Status { get; set; }

        public int CustomerId { get; set; }

        public virtual Customer Customer { get; set; }
    }
}
