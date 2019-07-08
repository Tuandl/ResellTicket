using System;

namespace Core.Infrastructure
{
    public abstract class EntityBase
    {
        public int Id { get; set; }
        public DateTime CreatedAtUTC { get; set; }
        public DateTime? UpdatedAtUTC { get; set; }
        public bool Deleted { get; set; }
    }
}
