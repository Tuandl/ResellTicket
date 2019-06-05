﻿using Microsoft.AspNetCore.Identity;

namespace Core.Models
{
    public class User : IdentityUser
    {
        public string FullName { get; set; } 
        public bool IsActive { get; set; }
    }
}
