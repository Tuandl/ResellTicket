using Core.Infrastructure;
using Core.Models;

namespace Core.Repository
{
    public interface ICustomerRepository : IRepository<Customer>
    {

    }

    public class CustomerRepository : RepositoryBase<Customer>, ICustomerRepository
    {
        public CustomerRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {
        }
    }
}
