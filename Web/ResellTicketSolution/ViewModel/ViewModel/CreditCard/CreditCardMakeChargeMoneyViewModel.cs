using System;
using System.Collections.Generic;
using System.Text;

namespace ViewModel.ViewModel.CreditCard
{
    public class CreditCardMakeChargeMoneyViewModel
    {
        public int Id { get; set; }
        public string CardId { get; set; }
        public bool Isdefault { get; set; }
        public int CustomerId { get; set; }
    }
}
