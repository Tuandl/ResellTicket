using Core.Infrastructure;
using Core.Models;

namespace Core.Repository
{
    public interface ITicketRepository : IRepository<Ticket>
    {

    }

    public class TicketRepository : RepositoryBase<Ticket>, ITicketRepository
    {
        public TicketRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {
        }
    }
}
