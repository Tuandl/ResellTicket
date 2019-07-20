using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Models.Map
{
    public class StationMap : IEntityTypeConfiguration<Station>
    {
        public void Configure(EntityTypeBuilder<Station> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.City)
                .WithMany(x => x.Stations)
                .HasForeignKey(x => x.CityId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.ToTable("Station");
        }
    }
}
