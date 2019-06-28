using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Models.Map
{
    public class AdminDeviceMap : IEntityTypeConfiguration<AdminDevice>
    {
        public void Configure(EntityTypeBuilder<AdminDevice> builder)
        {
            builder.HasKey(x => x.Id);

            builder.ToTable("AdminDevice");

            builder.HasOne(x => x.User)
                .WithMany(x => x.AdminDevices)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
