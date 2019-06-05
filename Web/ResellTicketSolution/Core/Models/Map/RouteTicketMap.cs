using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Models.Map
{
    public class RouteTicketMap : IEntityTypeConfiguration<RouteTicket>
    {
        public void Configure(EntityTypeBuilder<RouteTicket> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.Ticket)
                .WithMany(x => x.RouteTickets)
                .HasForeignKey(x => x.TicketId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Departure)
                .WithMany(x => x.DepartureRouteTickets)
                .HasForeignKey(x => x.DepartureId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Arrival)
                .WithMany(x => x.ArrivalRouteTickets)
                .HasForeignKey(x => x.ArrivalId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Route)
                .WithMany(x => x.RouteTickets)
                .HasForeignKey(x => x.RouteId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.ToTable("RouteTicket");
        }
    }
}
