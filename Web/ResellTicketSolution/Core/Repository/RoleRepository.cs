using System;
using System.Collections.Generic;
using System.Text;
using Core.Infrastructure;
using Core.Models;

namespace Core.Repository
{
    public interface IRoleRepository : IRepository<Role>
    {

    }
    public class RoleRepository : RepositoryBase<Role>, IRoleRepository 
    {
        public RoleRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {
        }
    }
}
