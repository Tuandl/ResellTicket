﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Models.Map
{
    public class PayoutMap : IEntityTypeConfiguration<Payout>
    {
        public void Configure(EntityTypeBuilder<Payout> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.Ticket)
                .WithMany(x => x.Payouts)
                .HasForeignKey(x => x.TicketId)
                .OnDelete(DeleteBehavior.Restrict);

            //builder.HasOne(x => x.CreditCard)
            //    .WithMany(x => x.Payouts)
            //    .HasForeignKey(x => x.CreditCardId)
            //    .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Payment)
                .WithMany(x => x.Payouts)
                .HasForeignKey(x => x.PaymentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.Amount)
                .HasColumnType("decimal(18,2)");

            builder.Property(x => x.FeeAmount)
                .HasColumnType("decimal(18,2)");

            builder.ToTable("Payout");
        }
    }
}
