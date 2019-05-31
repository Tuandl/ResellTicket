using Core.Infrastructure;
using Microsoft.AspNetCore.Identity;

namespace Core.Repository
{
    public interface IUserRoleRepository : IRepository<IdentityUserRole<string>>
    {

    }

    public class UserRoleRepository : RepositoryBase<IdentityUserRole<string>>, IUserRoleRepository
    {
        public UserRoleRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {

        }
    }
}
