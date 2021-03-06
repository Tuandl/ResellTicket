﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace Core.Infrastructure
{
    public interface IRepository<T> where T : class
    {
        void Add(T entity);

        /// <summary>
        /// Update Entity which get from db
        /// </summary>
        /// <param name="entity"></param>
        void Update(T entity);

        /// <summary>
        /// Update Entity which did not tracking in db
        /// </summary>
        /// <param name="entity"></param>
        void UpdateNoTracking(T entity);

        void Delete(T entity);
        void Delete(Expression<Func<T, bool>> where);
        T Get(Expression<Func<T, bool>> where);
        IEnumerable<T> GetAll();
        IQueryable<T> GetAllQueryable();
        IEnumerable<T> GetMany(Expression<Func<T, bool>> where);
        void Attach(T entity);
    }
}
