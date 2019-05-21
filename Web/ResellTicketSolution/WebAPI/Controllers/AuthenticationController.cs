using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using ViewModel.ViewModel.Authentication;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;

        public AuthenticationController(
            IAuthenticationService authenticationService
            )
        {
            _authenticationService = authenticationService;
        }

        [AllowAnonymous]
        [HttpPost]
        public ActionResult RequestToken(LoginViewModel model)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest("Invalid Request");
            }

            //string token = string.Empty;
            //if(_authenticationService.IsAuthenticated(model, out token))
            //{
            //    return Ok(token);
            //}

            return BadRequest("Invalid Request");
        }
    }
}