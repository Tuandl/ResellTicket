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

        /// <summary>
        /// Config Models using Fluent API
        /// </summary>
        /// <param name="modelBuilder"></param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfiguration(new CustomerMap());
            modelBuilder.ApplyConfiguration(new TicketMap());
        }
    }
}
