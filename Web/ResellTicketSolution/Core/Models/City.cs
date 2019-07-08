using Core.Infrastructure;
using System.Collections.Generic;

namespace Core.Models
{
    public class City : EntityBase
    {
        public string Name { get; set; }

        /// <summary>
        /// id of time zone get from TimeZoneInfo.GetSystemTimeZones()
        /// </summary>
        public string TimeZoneId { get; set; }

        public virtual ICollection<Station> Stations { get; set; }
    }
}
