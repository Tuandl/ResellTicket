using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Models.Map
{
    public class TransportationMap : IEntityTypeConfiguration<Transportation>
    {
        public void Configure(EntityTypeBuilder<Transportation> builder)
        {
            builder.HasKey(x => x.Id);

            builder.ToTable("Transportation");
        }
    }
}
