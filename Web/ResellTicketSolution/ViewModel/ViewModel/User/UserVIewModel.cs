using System.ComponentModel.DataAnnotations;

namespace ViewModel.ViewModel.User
{
    public class UserViewModel
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string FullName { get; set; }

    }
}
