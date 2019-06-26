using System;
using System.Collections.Generic;
using System.Text;

namespace ViewModel.ViewModel.CreditCard
{
    public class CreaditCardCreateViewModel
    {
        public string CardId { get; set; }
        public string Brand { get; set; }
        public string Name { get; set; }
        public string NameOnCard { get; set; }
        public string Cvc { get; set; }
        public string PostalCode { get; set; }
        public bool Isdefault { get; set; }
        public string Last4DigitsHash { get; set; }
        public string ExpiredYearHash { get; set; }
        public string ExpiredMonthHash { get; set; }
        public int CustomerId { get; set; }
    }
}
