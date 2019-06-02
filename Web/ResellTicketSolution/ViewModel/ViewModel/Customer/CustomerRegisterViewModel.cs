using System.ComponentModel.DataAnnotations;

namespace ViewModel.ViewModel.Customer
{
    public class CustomerRegisterViewModel
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string PasswordHash { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
    }
}
