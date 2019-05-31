using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Models.Map
{
    public class TransportationCategoryMap : IEntityTypeConfiguration<TransportationCategory>
    {
        public void Configure(EntityTypeBuilder<TransportationCategory> builder)
        {
            builder.HasKey(x => x.Id);
        }
    }
}
