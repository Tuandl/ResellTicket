using Core.Infrastructure;
using Core.Models;

namespace Core.Repository
{
    public interface ITransportationCategoryRepository : IRepository<TransportationCategory>
    {

    }

    public class TransportationCategoryRepository : RepositoryBase<TransportationCategory>, ITransportationCategoryRepository
    {
        public TransportationCategoryRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {
        }
    }
}
