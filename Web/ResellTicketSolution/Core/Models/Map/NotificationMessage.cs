using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Models.Map
{
    public class NotificationMessageMap : IEntityTypeConfiguration<NotificationMessage>
    {
        public void Configure(EntityTypeBuilder<NotificationMessage> builder)
        {
            builder.HasKey(x => x.Type);

            builder.ToTable("NotificationMessage");
        }
    }
}
