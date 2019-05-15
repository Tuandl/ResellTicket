using Core.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;

namespace Core.Infrastructure
{
    public interface IDatabaseFactory : IDisposable
    {
        ResellTicketDbContext Get();
        ResellTicketDbContext GetNew();
    }

    public class DatabaseFactory : Disposable, IDatabaseFactory
    {
        private ResellTicketDbContext _dataContext;
        private IConfiguration _configuration;

        public DatabaseFactory(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public ResellTicketDbContext Get()
        {
            if(_dataContext == null)
            {
                var dbOptionsBuilder = new DbContextOptionsBuilder<ResellTicketDbContext>();
                dbOptionsBuilder.UseSqlServer(_configuration.GetConnectionString("ResellTicketDB"));

                _dataContext = new ResellTicketDbContext(dbOptionsBuilder.Options);
            }

            return _dataContext;
        }

        public ResellTicketDbContext GetNew()
        {
            _dataContext?.Dispose();

            var dbOptionsBuilder = new DbContextOptionsBuilder<ResellTicketDbContext>();
            dbOptionsBuilder.UseSqlServer(_configuration.GetConnectionString("ResellTicketDB"));

            _dataContext = new ResellTicketDbContext(dbOptionsBuilder.Options);
            return _dataContext;
        }

        protected override void DisposeCore()
        {
            _dataContext?.Dispose();
            base.DisposeCore();
        }
    }
}
