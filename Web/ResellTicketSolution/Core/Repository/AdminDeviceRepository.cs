using Core.Infrastructure;
using Core.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Repository
{
    public interface IAdminDeviceRepository : IRepository<AdminDevice>
    {

    }
    public class AdminDeviceRepository : RepositoryBase<AdminDevice>, IAdminDeviceRepository
    {
        public AdminDeviceRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {
        }
    }
}
