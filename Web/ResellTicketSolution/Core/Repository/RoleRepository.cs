using Core.Infrastructure;
using Microsoft.AspNetCore.Identity;

namespace Core.Repository
{
    public interface IRoleRepository : IRepository<IdentityRole>
    {

    }

    public class RoleRepository : RepositoryBase<IdentityRole>, IRoleRepository
    {
        public RoleRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {

        }
    }
}
