using Core.Infrastructure;

namespace Core.Models
{
    public class Payout : EntityBase
    {
        public int CreditCardId { get; set; }
        public int TicketId { get; set; }
        public decimal Amount { get; set; }
        public decimal FeeAmount { get; set; }
        public bool Status { get; set; }
        public virtual Ticket Ticket { get; set; }
        public virtual CreditCard CreditCard { get; set; }
    }
}
