using Core.Data;

namespace Core.Infrastructure
{
    public interface IUnitOfWork
    {
        void CommitChanges();
        void StartTransaction();
        void CommitTransaction();
        void RollBackTransaction();
    }

    public class UnitOfWork : IUnitOfWork
    {
        private ResellTicketDbContext _dbContext;
        private IDatabaseFactory _dbFactory;

        public UnitOfWork(IDatabaseFactory databaseFactory)
        {
            _dbFactory = databaseFactory;
        }

        public ResellTicketDbContext DbContext { get => _dbContext ?? (_dbContext = _dbFactory.Get()); }

        public void CommitChanges()
        {
            DbContext.SaveChanges();
        }

        public void CommitTransaction()
        {
            DbContext.SaveChanges();
            DbContext.Database.CurrentTransaction.Commit();
        }

        public void RollBackTransaction()
        {
            DbContext.Database.CurrentTransaction.Rollback();
        }

        public void StartTransaction()
        {
            DbContext.Database.BeginTransaction();
        }
    }
}
