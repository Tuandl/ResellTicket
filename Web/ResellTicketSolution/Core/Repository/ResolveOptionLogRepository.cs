using Core.Infrastructure;
using Core.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Repository
{
    public interface IResolveOptionLogRepository : IRepository<ResolveOptionLog>
    {

    }
    public class ResolveOptionLogRepository : RepositoryBase<ResolveOptionLog>, IResolveOptionLogRepository
    {
        public ResolveOptionLogRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {
        }
    }
}
