using System;
using System.Collections.Generic;
using System.Text;

namespace ViewModel.ViewModel.Transaction
{
    public class TransactionDataTable
    {
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAtUTC { get; set; }
        public string Type { get; set; }
    }
}
