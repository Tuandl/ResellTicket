using AutoMapper;
using Core.Repository;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Linq;
using ViewModel.ViewModel.Role;

namespace Service.Services
{
    public interface IRoleService
    {
        /// <summary>
        /// Get all Roles in form of DataTable
        /// </summary>
        /// <returns></returns>
        RoleDataTable GetRoleDataTable();
    }

    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _roleRepository;
        private readonly IUserRoleRepository _userRoleRepository;
        private readonly IMapper _mapper;

        public RoleService(
                IRoleRepository roleRepository,
                IUserRoleRepository userRoleRepository,
                IMapper mapper
            )
        {
            _roleRepository = roleRepository;
            _userRoleRepository = userRoleRepository;
            _mapper = mapper;
        }

        /// <summary>
        /// Implement method GetRoleDataTable of interface
        /// </summary>
        /// <returns></returns>
        public RoleDataTable GetRoleDataTable()
        {
            //Get data in database
            var roles = _roleRepository.GetAll();

            //Convert into Viewmodel
            var roleViewModels = _mapper.Map<IEnumerable<IdentityRole>, IEnumerable<RoleViewModel>>(roles);
            var result = new RoleDataTable()
            {
                Data = roleViewModels.ToList(),
                Total = roleViewModels.Count(),
            };

            return result;
        }
    }
}
