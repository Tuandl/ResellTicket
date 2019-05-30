using System;
using System.Collections.Generic;
using System.Text;
using Core.Infrastructure;
using Core.Models;

namespace Core.Repository
{
    public interface IUserRoleRepository : IRepository<UserRole>
    {

    }

    public class UserRoleRepository : RepositoryBase<UserRole>, IUserRoleRepository
    {
        public UserRoleRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {
        }
    }
}
