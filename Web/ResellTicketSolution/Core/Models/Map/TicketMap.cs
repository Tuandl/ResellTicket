using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Models.Map
{
    public class TicketMap : IEntityTypeConfiguration<Ticket>
    {
        public void Configure(EntityTypeBuilder<Ticket> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.Customer)
                .WithMany(x => x.Tickets)
                .HasForeignKey(x => x.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);
            
            builder.HasOne(x => x.TicketType)
                .WithMany(x => x.Tickets)
                .HasForeignKey(x => x.TicketTypeId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.Transportation)
                .WithMany(x => x.Tickets)
                .HasForeignKey(x => x.TransportationId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Departure)
                .WithMany(x => x.DepartureTickets)
                .HasForeignKey(x => x.DepartureId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.Arrival)
                .WithMany(x => x.ArrivalTickets)
                .HasForeignKey(x => x.ArrivalId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.ToTable("Ticket");
        }
    }
}
