using Core.Enum;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using System.Linq;
using ViewModel.ErrorViewModel;
using ViewModel.ViewModel.Notification;

namespace Service.Services
{
    public interface INotificationService
    {
        /// <summary>
        /// Save notification and add serialized data into it
        /// </summary>
        /// <param name="customerId"></param>
        /// <param name="type"></param>
        /// <param name="data"></param>
        void SaveNotification(int customerId, NotificationType type, object data);

        /// <summary>
        /// Set exieted notification Read = true    
        /// </summary>
        /// <param name="notificationId"></param>
        void ReadNotification(int notificationId);

        /// <summary>
        /// Get notification Data Table of a customer
        /// </summary>
        /// <param name="username"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        NotificationDataTable GetNotificationDataTable(string username, int page, int pageSize);

        /// <summary>
        /// Count number notification unread of a customer
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        NotificationCountViewModel CountUnreadNotifications(string username);

        /// <summary>
        /// Mark all Notifications as read for this customer
        /// </summary>
        /// <param name="usename"></param>
        void ReadAllNotification(string usename);
    }

    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IUnitOfWork _unitOfWork;

        public NotificationService(
                INotificationRepository notificationRepository,
                IUnitOfWork unitOfWork
            )
        {
            _notificationRepository = notificationRepository;
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Save notification and add serialized data into it
        /// </summary>
        /// <param name="notification"></param>
        /// <param name="data"></param>
        public void SaveNotification(int customerId, NotificationType type, object data)
        {
            var notification = new Notification()
            {
                CustomerId = customerId, 
                Type = type,
                Data = Newtonsoft.Json.JsonConvert.SerializeObject(data),
                Read = false,
            };

            _notificationRepository.Add(notification);
            _unitOfWork.CommitChanges();
        }

        /// <summary>
        /// Set exieted notification Read = true    
        /// </summary>
        /// <param name="notificationId"></param>
        public void ReadNotification(int notificationId)
        {
            var existedNotification = _notificationRepository.Get(x => 
                x.Id == notificationId && 
                x.Deleted == false
            );

            if(existedNotification == null) 
                throw new NotFoundException();

            existedNotification.Read = true;
            _notificationRepository.Update(existedNotification);
            _unitOfWork.CommitChanges();
        }

        /// <summary>
        /// Get notification Data Table of a customer
        /// </summary>
        /// <param name="username"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public NotificationDataTable GetNotificationDataTable(string username, int page, int pageSize)
        {
            var notifications = _notificationRepository.GetAllQueryable()
                .Where(x => 
                    x.Deleted == false &&
                    x.Customer.Username == username
                )
                .Select(x => new NotificationViewModel() { 
                    Id = x.Id,
                    Data = x.Data,
                    CreatedAtUTC = x.CreatedAtUTC,
                    Message = x.Message.Content,
                    Read = x.Read,
                    Type = x.Type,
                });

            var notificationOrdered = notifications.OrderByDescending(x => x.CreatedAtUTC);

            var paged = notificationOrdered.Skip((page - 1) * pageSize).Take(pageSize);
            
            return new NotificationDataTable()
            {
                Data = paged.ToList(),
                Total = notificationOrdered.Count(),
            };
        }

        /// <summary>
        /// Count number notification unread of a customer
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public NotificationCountViewModel CountUnreadNotifications(string username)
        {
            var quantity = _notificationRepository.GetAllQueryable()
                .Where(x => x.Customer.Username == username && x.Deleted == false)
                .Count();

            return new NotificationCountViewModel() {
                Quantity = quantity 
            };
        }

        public void ReadAllNotification(string usename)
        {
            var unreadNotifications = _notificationRepository.GetAllQueryable()
                .Where(x => 
                    x.Deleted == false &&
                    x.Customer.Username == usename &&
                    x.Read == false
                );

            foreach (var unreadNotification in unreadNotifications)
            {
                unreadNotification.Read = true;
                _notificationRepository.Update(unreadNotification);
            }

            _unitOfWork.CommitChanges();
        }
    }
}
