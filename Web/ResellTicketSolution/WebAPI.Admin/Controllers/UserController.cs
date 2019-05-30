using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using ViewModel.ViewModel.User;

namespace WebAPI.Admin.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService) //inject userService 
        {
            _userService = userService;
        }

        [Authorize()] //Roles = "Manager"
        [HttpGet]
        public ActionResult<IEnumerable<UserRowViewModel>> GetUsers(string orderBy, string param) { //Lấy all admin users
            var userRowViewModels = _userService.GetUsers(orderBy, param); 
            return userRowViewModels; 
            
        }

        [Authorize()] //Roles = "Manager"
        [HttpGet("id")]
        public async Task<ActionResult<UserRowViewModel>> FindUserById(string id)
        { //Lấy all admin users
            var userRowViewModel = await _userService.FindUserById(id);
            return userRowViewModel;
        }

        //[Authorize()] //Roles = "Manager"
        //[HttpGet("search")]
        //public ActionResult<IEnumerable<UserRowViewModel>> GetUsersByFullName(string param)
        //{ //Lấy all admin users
        //    var userRowViewModels = _userService.GetUsersByFullNameOrUserName(param);
        //    return userRowViewModels;
        //}
    }
}