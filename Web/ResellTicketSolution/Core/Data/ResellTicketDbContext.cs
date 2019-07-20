using Core.Models;
using Core.Models.Map;
using Microsoft.AspNetCore.Identity;
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
        public virtual DbSet<TicketType> TicketTypes { get; set; }
        public virtual DbSet<City> Cities { get; set; }
        public virtual DbSet<RouteTicket> RouteTickets { get; set; }
        public virtual DbSet<Station> Stations { get; set; }
        public virtual DbSet<Vehicle> Vehicles { get; set; }
        public virtual DbSet<Transportation> Transportations { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
        public virtual DbSet<Payout> Payouts { get; set; }
        public virtual DbSet<OTP> OTPs { get; set; }
        public virtual DbSet<CreditCard> CreditCards { get; set; }
        public virtual DbSet<Refund> Refunds { get; set; }
        public virtual DbSet<Payment> Payments { get; set; }
        public virtual DbSet<Route> Routes { get; set; }
        public virtual DbSet<CustomerDevice> CustomerDevices { get; set; }
        public virtual DbSet<AdminDevice> AdminDevices { get; set; }
        public virtual DbSet<NotificationMessage> NotificationMessages { get; set; }
        public virtual DbSet<ResolveOptionLog> ResolveOptionLogs { get; set; }
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
            modelBuilder.ApplyConfiguration(new VehicleMap());
            modelBuilder.ApplyConfiguration(new TransportationMap());
            modelBuilder.ApplyConfiguration(new NotificationMap());
            modelBuilder.ApplyConfiguration(new PayoutMap());
            modelBuilder.ApplyConfiguration(new OTPMap());
            modelBuilder.ApplyConfiguration(new CreditCardMap());
            modelBuilder.ApplyConfiguration(new RefundMap());
            modelBuilder.ApplyConfiguration(new PaymentMap());
            modelBuilder.ApplyConfiguration(new RouteMap());
            modelBuilder.ApplyConfiguration(new TicketTypeMap());
            modelBuilder.ApplyConfiguration(new CustomerDeviceMap());
            modelBuilder.ApplyConfiguration(new AdminDeviceMap());
            modelBuilder.ApplyConfiguration(new NotificationMessageMap());
            modelBuilder.ApplyConfiguration(new ResolveOptionLogMap());

            modelBuilder.Entity<User>().ToTable("User");
            modelBuilder.Entity<IdentityUserRole<string>>().ToTable("UserRole");
            modelBuilder.Entity<IdentityRole>().ToTable("Role");

            modelBuilder.Ignore<IdentityUserLogin<string>>();
            modelBuilder.Ignore<IdentityUserClaim<string>>();
            modelBuilder.Ignore<IdentityUserToken<string>>();
            modelBuilder.Ignore<IdentityRoleClaim<string>>();

            modelBuilder.Entity<NotificationMessage>().HasData(
                new NotificationMessage() {Type = Enum.NotificationType.TicketIsValid, Content = "Your posted ticket is valid. Now people can buy your ticket." },
                new NotificationMessage() {Type = Enum.NotificationType.TicketIsBought, Content = "Your ticket is bought. Please change this ticket information." },
                new NotificationMessage() {Type = Enum.NotificationType.TicketIsReject, Content = "Your ticket is invalid. Please check again." },
                new NotificationMessage() {Type = Enum.NotificationType.TicketIsConfirmedRenamed, Content = "Your ticket is confirmed renamed successfully." },
                new NotificationMessage() {Type = Enum.NotificationType.TicketIsRenamed, Content = "A ticket in your route is renamed successfully." },
                new NotificationMessage() {Type = Enum.NotificationType.TicketIsConfirmedRenamedFailed, Content = "Sorry, our system cannot confirm your ticket is renamed correctly." },
                new NotificationMessage() {Type = Enum.NotificationType.TicketIsRefuse, Content = "A ticket in your route is refused. We are processing your refund." }
            );
        }
    }
}
