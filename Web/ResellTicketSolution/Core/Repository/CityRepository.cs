using Core.Infrastructure;
using Core.Models;

namespace Core.Repository
{
    public interface ICityRepository : IRepository<City>
    {

    }

    public class CityRepository : RepositoryBase<City>, ICityRepository
    {
        public CityRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {
        }
    }
}
