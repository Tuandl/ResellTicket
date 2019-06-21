using Core.Infrastructure;
using System.Collections.Generic;

namespace Core.Models
{
    public class Customer : EntityBase
    {
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string SaltPasswordHash { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        public int StripeId { get; set; }
        public virtual ICollection<Ticket> Tickets { get; set; }
        public virtual ICollection<Notification> Notifications { get; set; }
        public virtual ICollection<CreditCard> CreditCards { get; set; }
        public virtual ICollection<Route> Routes { get; set; }
    }
}
