﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Models.Map
{
    public class PaymentMap : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.Route)
                .WithMany(x => x.Payments)
                .HasForeignKey(x => x.RouteId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.CreditCard)
                .WithMany(x => x.Payments)
                .HasForeignKey(x => x.CreditCartId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.ToTable("Payment");
        }
    }
}
