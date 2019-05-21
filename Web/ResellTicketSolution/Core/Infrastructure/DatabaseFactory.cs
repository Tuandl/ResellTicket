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
        public const string CONNECTION_NAME = "ResellTicketDB";

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
                dbOptionsBuilder.UseSqlServer(_configuration.GetConnectionString(CONNECTION_NAME));

                _dataContext = new ResellTicketDbContext(dbOptionsBuilder.Options);
            }

            return _dataContext;
        }

        public ResellTicketDbContext GetNew()
        {
            _dataContext?.Dispose();

            var dbOptionsBuilder = new DbContextOptionsBuilder<ResellTicketDbContext>();
            dbOptionsBuilder.UseSqlServer(_configuration.GetConnectionString(CONNECTION_NAME));

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
