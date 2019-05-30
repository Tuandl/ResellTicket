using System;
using System.Collections.Generic;
using System.Text;
using Core.Infrastructure;

namespace Core.Models
{
    public class Route : EntityBase
    {
        public int CustomerId { get; set; }
        public string Code { get; set; }
        public decimal TotalAmount { get; set; }
        public int Status { get; set; }
    }
}
