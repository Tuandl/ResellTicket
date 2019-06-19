using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Models.Map
{
    public class TicketMap : IEntityTypeConfiguration<Ticket>
    {
        public void Configure(EntityTypeBuilder<Ticket> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.Buyer)
                .WithMany(x => x.Tickets)
                .HasForeignKey(x => x.BuyerId)
                .OnDelete(DeleteBehavior.Restrict);
            
            builder.HasOne(x => x.TicketType)
                .WithMany(x => x.Tickets)
                .HasForeignKey(x => x.TicketTypeId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.Transportation)
                .WithMany(x => x.Tickets)
                .HasForeignKey(x => x.TransportationId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.DepartureStation)
                .WithMany(x => x.DepartureTickets)
                .HasForeignKey(x => x.DepartureStationId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.ArrivalStation)
                .WithMany(x => x.ArrivalTickets)
                .HasForeignKey(x => x.ArrivalStationId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.CommissionPercent)
                .HasColumnType("decimal(18,2)");

            builder.Property(x => x.SellingPrice)
                .HasColumnType("decimal(18,2)");

            builder.ToTable("Ticket");
        }
    }
}
