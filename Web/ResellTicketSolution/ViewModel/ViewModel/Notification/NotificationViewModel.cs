using Core.Enum;
using System;

namespace ViewModel.ViewModel.Notification
{
    public class NotificationViewModel
    {
        public int Id { get; set; }

        public DateTime CreatedAtUTC { get; set; }

        public NotificationType Type { get; set; }

        public string Data { get; set; }

        public bool Read { get; set; }

        public string Message { get; set; }
    }
}
