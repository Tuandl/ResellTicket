using Core.Models;
using Core.Models.Map;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Core.Data
{
    public class ResellTicketDbContext : IdentityDbContext<User>
    {
        public ResellTicketDbContext(DbContextOptions options)
            : base(options)
        {
        }

        //Register Models
        public virtual DbSet<Customer> Customers { get; set; }
        public virtual DbSet<Ticket> Tickets { get; set; }
        public virtual DbSet<City> Cities { get; set; }
        public virtual DbSet<RouteTicket> RouteTickets { get; set; }
        public virtual DbSet<Station> Stations { get; set; }
        public virtual DbSet<TransportationCategory> TransportationCategories { get; set; }
        public virtual DbSet<Transportation> Transportations { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
        public virtual DbSet<Payout> Payouts { get; set; }
        public virtual DbSet<OTP> OTPs { get; set; }
        public virtual DbSet<CreditCard> CreditCards { get; set; }
        public virtual DbSet<Refund> Refunds { get; set; }
        public virtual DbSet<Payment> Payments { get; set; }
        public virtual DbSet<Route> Routes { get; set; }

        /// <summary>
        /// Config Models using Fluent API
        /// </summary>
        /// <param name="modelBuilder"></param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfiguration(new CustomerMap());
            modelBuilder.ApplyConfiguration(new TicketMap());
            modelBuilder.ApplyConfiguration(new CityMap());
            modelBuilder.ApplyConfiguration(new RouteTicketMap());
            modelBuilder.ApplyConfiguration(new StationMap());
            modelBuilder.ApplyConfiguration(new TransportationCategoryMap());
            modelBuilder.ApplyConfiguration(new TransportationMap());
            modelBuilder.ApplyConfiguration(new NotificationMap());
            modelBuilder.ApplyConfiguration(new PayoutMap());
            modelBuilder.ApplyConfiguration(new OTPMap());
            modelBuilder.ApplyConfiguration(new CreditCardMap());
            modelBuilder.ApplyConfiguration(new RefundMap());
            modelBuilder.ApplyConfiguration(new PaymentMap());
            modelBuilder.ApplyConfiguration(new RouteMap());

        }
    }
}
