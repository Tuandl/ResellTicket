using System;
using System.Collections.Generic;
using System.Text;
using Core.Infrastructure;
using Core.Models;

namespace Core.Repository
{
    public interface ICreditCardRepository : IRepository<CreditCard>
    {

    }
    public class CreditCardRepository : RepositoryBase<CreditCard>, ICreditCardRepository
    {
        public CreditCardRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {

        }
    }
}
