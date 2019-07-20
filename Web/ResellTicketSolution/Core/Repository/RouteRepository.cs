using Core.Infrastructure;
using Core.Models;

namespace Core.Repository
{
    public interface IRouteRepository : IRepository<Route>
    {

    }
    public class RouteRepository : RepositoryBase<Route>, IRouteRepository
    {
        public RouteRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {

        }
    }
}
