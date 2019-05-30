using Core.Infrastructure;

namespace Core.Models
{
    public class Transportation : EntityBase
    {
        public int Id { get; set; }

        public int TransportationCategoryId { get; set; }

        public string Name { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }
    }
}
