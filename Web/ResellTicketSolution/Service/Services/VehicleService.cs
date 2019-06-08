using AutoMapper;
using Core.Models;
using Core.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ViewModel.ViewModel.Vehicle;

namespace Service.Services
{
    public interface IVehicleService
    {
        List<VehicleRowViewModel> GetVehicles();
    }
    public class VehicleService : IVehicleService
    {
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IMapper _mapper;
        
        public VehicleService(IVehicleRepository vehicleRepository, IMapper mapper)
        {
            _vehicleRepository = vehicleRepository;
            _mapper = mapper;
        }

        public List<VehicleRowViewModel> GetVehicles()
        {
            var vehicles = _vehicleRepository.GetAllQueryable().Where(x => x.Deleted == false).ToList(); ;

            var vehicleRowViewModel = _mapper.Map<List<Vehicle>, List<VehicleRowViewModel>>(vehicles);

            return vehicleRowViewModel;
        }
    }
}
