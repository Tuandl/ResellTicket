using System.Collections;
using System.Collections.Generic;
using Core.Infrastructure;

namespace Core.Models
{
    public class CreditCard : EntityBase
    {
        public string CardId { get; set; }
        public string Brand { get; set; }
        public string Name { get; set; }
        public string NameOnCard { get; set; }
        public string PostalCode { get; set; }
        public string Cvc { get; set; }
        public string Last4DigitsHash { get; set; }
        public string ExpiredYearHash { get; set; }
        public string ExpiredMonthHash { get; set; }
        public int CustomerId { get; set; }
        public virtual Customer Customer { get; set; }
        public virtual ICollection<Payout> Payouts { get; set; }
        public virtual ICollection<Payment> Payments { get; set; }
    }
}
