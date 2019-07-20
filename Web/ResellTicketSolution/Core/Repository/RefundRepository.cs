using Core.Infrastructure;
using Core.Models;

namespace Core.Repository
{
    public interface IRefundRepository : IRepository<Refund>
    {

    }
    public class RefundRepository : RepositoryBase<Refund>, IRefundRepository
    {
        public RefundRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {

        }
    }
}
