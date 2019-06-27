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
        public string StripeId { get; set; }
        public virtual ICollection<Ticket> SoldTickets { get; set; }
        public virtual ICollection<Ticket> BoughtTickets { get; set; }
        public virtual ICollection<Notification> Notifications { get; set; }
        public virtual ICollection<CreditCard> CreditCards { get; set; }
        public virtual ICollection<Route> Routes { get; set; }
        public virtual ICollection<CustomerDevice> CustomerDevices { get; set; }
    }
}
