using Core.Infrastructure;
using Core.Models;

namespace Core.Repository
{
    public interface IUserRepository : IRepository<User>
    {

    }

    public class UserRepository : RepositoryBase<User>, IUserRepository
    {
        public UserRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {
        }
    }
}
