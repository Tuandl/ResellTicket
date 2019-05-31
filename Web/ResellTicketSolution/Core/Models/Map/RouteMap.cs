using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Models.Map
{
    public class RouteMap : IEntityTypeConfiguration<Route>
    {
        public void Configure(EntityTypeBuilder<Route> builder)
        {
            builder.HasKey(x => x.Id);

            builder.ToTable("Route");
        }
    }
}
