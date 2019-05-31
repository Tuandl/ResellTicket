using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

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
