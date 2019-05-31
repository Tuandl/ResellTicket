using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Models.Map
{
    public class StationMap : IEntityTypeConfiguration<Station>
    {
        public void Configure(EntityTypeBuilder<Station> builder)
        {
            builder.HasKey(x => x.Id);

            builder.ToTable("Station");
        }
    }
}
