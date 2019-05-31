using Core.Infrastructure;

namespace Core.Models
{
    public class CreditCard : EntityBase
    {
        public int CustomerId { get; set; }
        public string CardId { get; set; }
        public string Brand { get; set; }
        public string Last4DigitsHash { get; set; }
        public string ExpiredYearHash { get; set; }
        public string ExpiredMonthHash { get; set; }
        
    }
}
