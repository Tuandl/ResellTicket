using System.Collections;
using System.Collections.Generic;
using Core.Infrastructure;

namespace Core.Models
{
    public class City : EntityBase
    {
        public string Name { get; set; }
        public virtual ICollection<Station> Stations { get; set; }
    }
}
