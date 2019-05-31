using System.ComponentModel.DataAnnotations;

namespace ViewModel.ViewModel.User
{
    public class UserRegisterViewModel
    {
        [Required]
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string FullName { get; set; }
        public bool IsActive { get; set; }
        public string RoleId { get; set; }

    }
}
