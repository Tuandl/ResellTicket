using Core.Enum;
using System.Collections;
using System.Collections.Generic;

namespace Core.Models
{
    public class NotificationMessage
    {
        public NotificationType Type { get; set; }
        public string Content { get; set; }

        public virtual ICollection<Notification> Notifications { get; set; }
    }
}
