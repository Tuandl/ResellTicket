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
        }
    }
}
