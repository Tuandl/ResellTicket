using System;
using System.Collections.Generic;
using System.Text;
using Core.Infrastructure;
using Core.Models;

namespace Core.Repository
{
    public interface IPayoutRepository : IRepository<Payout>
    {

    }

    public class PayoutRepository : RepositoryBase<Payout>, IPayoutRepository
    {
        public PayoutRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {
        }
    }

}
