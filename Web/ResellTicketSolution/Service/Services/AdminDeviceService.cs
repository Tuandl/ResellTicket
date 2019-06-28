using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using System;
using System.Collections.Generic;
using System.Text;

namespace Service.Services
{
    public interface IAdminDeviceService
    {
       void AddAdminDevice(string userId, string deviceId);
    }
    public class AdminDeviceService : IAdminDeviceService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAdminDeviceRepository _adminDeviceRepository;
        public AdminDeviceService(IUnitOfWork unitOfWork, IAdminDeviceRepository adminDeviceRepository)
        {
            _unitOfWork = unitOfWork;
            _adminDeviceRepository = adminDeviceRepository;
        }
        public void AddAdminDevice(string userId, string deviceId)
        {
            var adminDevice = _adminDeviceRepository.Get(x => x.DeviceId == deviceId);
            if(adminDevice == null)
            {
                adminDevice = new AdminDevice()
                {
                    UserId = userId,
                    DeviceId = deviceId,
                    IsLogout = false
                };
                _adminDeviceRepository.Add(adminDevice);
            } else
            {
                adminDevice.UserId = userId;
                adminDevice.IsLogout = false;
                _adminDeviceRepository.Update(adminDevice);
            }
            _unitOfWork.CommitChanges();
        }
    }
}
