using Core.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace Core.Infrastructure
{
    public class RepositoryBase<T> : IRepository<T> where T : class
    {
        private ResellTicketDbContext _dbContext;
        private readonly DbSet<T> _dbSet;
        
        protected IDatabaseFactory DataBaseFactory { get; private set; }
        protected ResellTicketDbContext DbContext { get => _dbContext ?? (_dbContext = DataBaseFactory.Get()); }

        public RepositoryBase(IDatabaseFactory databaseFactory)
        {
            DataBaseFactory = databaseFactory;
            _dbSet = DbContext.Set<T>();
        }

        public void Add(T entity)
        {
            if(entity.GetType().IsSubclassOf(typeof(EntityBase)))
            {
                (entity as EntityBase).CreatedAt = DateTime.Now;
            }

            _dbSet.Add(entity);
        }

        public void Delete(T entity)
        {
            _dbSet.Remove(entity);
        }

        public void Delete(Expression<Func<T, bool>> where)
        {
            IEnumerable<T> entities = _dbSet.Where(where);
            _dbSet.RemoveRange(entities);
        }

        public T Get(Expression<Func<T, bool>> where)
        {
            return _dbSet.AsNoTracking().Where(where).FirstOrDefault();
        }

        public IEnumerable<T> GetAll()
        {
            return _dbSet.AsNoTracking().ToList();
        }

        public IQueryable<T> GetAllQueryable()
        {
            return _dbSet.AsQueryable();
        }

        public IEnumerable<T> GetMany(Expression<Func<T, bool>> where)
        {
            return _dbSet.AsNoTracking().Where(where).ToList();
        }

        public void Update(T entity)
        {
            if(entity.GetType().IsSubclassOf(typeof(EntityBase)))
            {
                (entity as EntityBase).UpdatedAt = DateTime.Now;
            }

            _dbSet.Attach(entity);
            DbContext.Entry(entity).State = EntityState.Modified;
        }

        public void Attach(T entity)
        {
            _dbSet.Attach(entity);
        }
    }
}
