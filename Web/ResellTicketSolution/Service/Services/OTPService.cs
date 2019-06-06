using AutoMapper;
using Core.Infrastructure;
using Core.Repository;
using System;
using System.Collections.Generic;
using System.Text;
using ViewModel.ViewModel.OTP;
using Core.Models;

namespace Service.Services
{
    public interface IOTPService
    {
        string CreatOTPWithEachPhone(string phoneNumber);
        
    }
    public class OTPService : IOTPService
    {
        private readonly IOTPRepository _oTPRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public OTPService(IOTPRepository oTPRepository, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _oTPRepository = oTPRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }
        public string CreatOTPWithEachPhone(string phoneNumber)
        {
            var newOTP = _oTPRepository.Get(x => x.PhoneNo.Equals(phoneNumber));
            string RandomNo = "12345";
            if (newOTP == null)
            {
                newOTP = new OTP();
                newOTP.PhoneNo = phoneNumber;
                newOTP.Code = RandomNo;
                newOTP.ExpiredAt = DateTime.Now.AddMinutes(5);
                _oTPRepository.Add(newOTP);
            }
            else
            {
                newOTP.Code = RandomNo;
                newOTP.ExpiredAt = DateTime.Now.AddMinutes(5);
                _oTPRepository.Update(newOTP);
            }
            _unitOfWork.CommitChanges();

            return RandomNo;
        }


    }
}
