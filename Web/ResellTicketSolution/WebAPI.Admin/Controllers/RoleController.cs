using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using ViewModel.ViewModel.Role;

namespace WebAPI.Admin.Controllers
{
    [Route("api/role")]
    [ApiController]
    [Authorize]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(
                IRoleService roleService
            )
        {
            _roleService = roleService;
        }

        /// <summary>
        /// Get Roles as DataTable
        /// </summary>
        /// <returns>Return List Roles</returns>
        /// <response code="200">Success</response>
        /// <response code="404">Not Found</response>
        [HttpGet]
        public ActionResult<RoleDataTable> GetRoles()
        { 
            var roleDataTable = _roleService.GetRoleDataTable();
            if(roleDataTable == null)
            {
                return NotFound();
            }
            return Ok(roleDataTable);
        }
    }
}