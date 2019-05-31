using Core.Infrastructure;
using Core.Models;

namespace Core.Repository
{
    public interface IPaymentRepository : IRepository<Payment>
    {

    }
    public class PaymentRepository : RepositoryBase<Payment>, IPaymentRepository
    {
        public PaymentRepository(IDatabaseFactory databaseFactory) : base(databaseFactory) 
        {

        }
    }
}
