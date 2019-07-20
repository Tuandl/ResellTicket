using Core.Infrastructure;
using Core.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Repository
{
    public interface ICustomerDeviceRepository : IRepository<CustomerDevice>
    {

    }
    public class CustomerDeviceRepository : RepositoryBase<CustomerDevice>, ICustomerDeviceRepository
    {
        public CustomerDeviceRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {
        }
    }
}
