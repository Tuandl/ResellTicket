using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Models.Map
{
    public class ResolveOptionLogMap : IEntityTypeConfiguration<ResolveOptionLog>
    {
        public void Configure(EntityTypeBuilder<ResolveOptionLog> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.Route)
                .WithMany(x => x.ResolveOptionLogs)
                .HasForeignKey(x => x.RouteId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.ResolvedTicket)
                .WithMany(x => x.ResolveOptionLogs)
                .HasForeignKey(x => x.TicketId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Staff)
                .WithMany(x => x.ResolveOptionLogs)
                .HasForeignKey(x => x.StaffId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.ToTable("ResolveOptionLog");
        }
    }
}
