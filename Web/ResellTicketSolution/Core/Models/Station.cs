using Core.Infrastructure;

namespace Core.Models
{
    public class Station : EntityBase
    {
        public int Id { get; set; }

        public int CityId { get; set; }

        public string Name { get; set; }
    }
}
