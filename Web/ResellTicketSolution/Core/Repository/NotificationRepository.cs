using Core.Infrastructure;
using Core.Models;

namespace Core.Repository
{
    public interface INotificationRepository : IRepository<Notification>
    {

    }

    public class NotificationRepository : RepositoryBase<Notification>, INotificationRepository
    {
        public NotificationRepository(IDatabaseFactory databaseFactory) : base(databaseFactory)
        {
        }
    }

}
