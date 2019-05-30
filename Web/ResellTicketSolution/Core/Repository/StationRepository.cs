using Core.Infrastructure;
using Core.Models;

namespace Core.Repository
{
    public interface IStationRepository : IRepository<Station>
    {

    }

    public class StationRepository : RepositoryBase<Station>, IStationRepository
    {
        public StationRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {
        }
    }
}
