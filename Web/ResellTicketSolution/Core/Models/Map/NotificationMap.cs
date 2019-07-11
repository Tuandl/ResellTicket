using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Models.Map
{
    public class NotificationMap : IEntityTypeConfiguration<Notification>
    {
        public void Configure(EntityTypeBuilder<Notification> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.Customer)
                .WithMany(x => x.Notifications)
                .HasForeignKey(x => x.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Message)
                .WithMany(x => x.Notifications)
                .HasForeignKey(x => x.Type)
                .OnDelete(DeleteBehavior.Restrict);

            builder.ToTable("Notification");

        }
    }
}
