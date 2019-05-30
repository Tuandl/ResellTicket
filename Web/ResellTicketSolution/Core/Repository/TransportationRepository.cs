using Core.Infrastructure;
using Core.Models;

namespace Core.Repository
{
    public interface ITransportationRepository : IRepository<Transportation>
    {

    }

    public class TransportationRepository : RepositoryBase<Transportation>, ITransportationRepository
    {
        public TransportationRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {
        }
    }
}
