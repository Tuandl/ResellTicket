using AutoMapper;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using System;

namespace Service.Services
{
    public interface IOTPService
    {
        string CreatOTPWithEachPhone(string phoneNumber);
    }

    public class OTPService : IOTPService
    {
        private const int OTP_EXPIRED_MIN = 2;

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
            string RandomNo = "123456";
            if (newOTP == null)
            {
                newOTP = new OTP();
                newOTP.PhoneNo = phoneNumber;
                newOTP.Code = RandomNo;
                newOTP.ExpiredAt = DateTime.Now.AddMinutes(OTP_EXPIRED_MIN);
                _oTPRepository.Add(newOTP);
            }
            else
            {
                newOTP.Code = RandomNo;
                newOTP.ExpiredAt = DateTime.Now.AddMinutes(OTP_EXPIRED_MIN);
                _oTPRepository.Update(newOTP);
            }
            _unitOfWork.CommitChanges();

            return RandomNo;
        }
    }
}
