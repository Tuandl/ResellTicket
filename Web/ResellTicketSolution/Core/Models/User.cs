using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace Core.Models
{
    public class User : IdentityUser
    {
        public string FullName { get; set; }
        public bool IsActive { get; set; }
        public virtual ICollection<AdminDevice> AdminDevices { get; set; }
    }
}
