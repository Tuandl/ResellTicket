using System.ComponentModel.DataAnnotations;

namespace ViewModel.ViewModel.Authentication
{
    public class LoginViewModel
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
        public string DeviceId { get; set; }
        public int DeviceType { get; set; }
    }
}
