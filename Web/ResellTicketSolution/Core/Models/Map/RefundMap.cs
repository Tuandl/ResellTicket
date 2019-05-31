using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Models.Map
{
    public class RefundMap : IEntityTypeConfiguration<Refund>
    {
        public void Configure(EntityTypeBuilder<Refund> builder)
        {
            builder.HasKey(x => x.Id);

            builder.ToTable("Refund");
        }
    }
}
