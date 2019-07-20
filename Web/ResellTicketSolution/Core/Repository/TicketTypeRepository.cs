using Core.Infrastructure;
using Core.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Repository
{
    public interface ITicketTypeRepository : IRepository<TicketType>
    {

    }
    public class TicketTypeRepository : RepositoryBase<TicketType>, ITicketTypeRepository
    {
        public TicketTypeRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {
        }
    }
}
