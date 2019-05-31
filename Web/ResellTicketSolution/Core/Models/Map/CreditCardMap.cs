using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Core.Models.Map
{
    public class CreditCardMap : IEntityTypeConfiguration<CreditCard>
    {
        public void Configure(EntityTypeBuilder<CreditCard> builder)
        {
            builder.HasKey(x=>x.Id);
            
            builder.ToTable("CreditCard");
        }
    }
}
