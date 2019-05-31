using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Models.Map
{
    public class RouteTicketMap : IEntityTypeConfiguration<RouteTicket>
    {
        public void Configure(EntityTypeBuilder<RouteTicket> builder)
        {
            builder.HasKey(x => x.Id);
        }
    }
}
