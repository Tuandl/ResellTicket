using Core.Enum;
using Core.Infrastructure;

namespace Core.Models
{
    public class Notification : EntityBase
    {
        public NotificationType Type { get; set; }

        public string Data { get; set; }

        public bool Read { get; set; }

        public int CustomerId { get; set; }

        public virtual Customer Customer { get; set; }

        public string Message { get; set; }
    }
}
