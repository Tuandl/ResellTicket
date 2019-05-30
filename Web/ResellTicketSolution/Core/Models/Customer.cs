using System;
using Core.Infrastructure;

namespace Core.Models
{
    public class Customer : EntityBase
    {
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
    }
}
