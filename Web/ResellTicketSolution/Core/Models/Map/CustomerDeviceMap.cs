using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Models.Map
{
    public class CustomerDeviceMap : IEntityTypeConfiguration<CustomerDevice>
    {
        public void Configure(EntityTypeBuilder<CustomerDevice> builder)
        {
            builder.HasKey(x => x.Id);

            builder.ToTable("CustomerDevice");

            builder.HasOne(x => x.Customer)
                .WithMany(x => x.CustomerDevices)
                .HasForeignKey(x => x.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
