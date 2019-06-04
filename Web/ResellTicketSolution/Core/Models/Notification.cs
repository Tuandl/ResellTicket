﻿using Core.Infrastructure;

namespace Core.Models
{
    public class Notification : EntityBase
    {
        public string Content { get; set; }
        public bool IsRead { get; set; }
        public int UserId { get; set; } //Sửa lại thành UserId

        public int CustomerId { get; set; }

        public virtual Customer Customer { get; set; }
    }
}