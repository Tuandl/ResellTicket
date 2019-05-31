using Core.Infrastructure;
using Core.Models;

namespace Core.Repository
{
    public interface IOTPRepository : IRepository<OTP>
    {

    }
    public class OTPRepository : RepositoryBase<OTP>, IOTPRepository
    {
        public OTPRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {

        }
    }
}
