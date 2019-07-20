using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ViewModel.ViewModel.User
{
    public class UserPasswordViewModel
    {
        public string Username { get; set; }
        public string CurrentPass { get; set; }
        public string NewPass { get; set; }
    }
}
