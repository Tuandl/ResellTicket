using Core.Infrastructure;
using Core.Models;

namespace Core.Repository
{
    public interface IRouteTicketRepository : IRepository<RouteTicket>
    {

    }

    public class RouteTicketRepository : RepositoryBase<RouteTicket>, IRouteTicketRepository
    {
        public RouteTicketRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {
        }
    }
}
