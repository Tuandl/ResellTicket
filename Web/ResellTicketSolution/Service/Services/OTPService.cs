using AutoMapper;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using Service.SMSService;
using System;

namespace Service.Services
{
    public interface IOTPService
    {
        string CreatOTPWithEachPhone(string phoneNumber);
    }

    public class OTPService : IOTPService
    {
        //{0:D8} use for format OTP 
        //"0" means the first param
        //D6 means convert this number into 6 character string
        private const string OTP_TEMPLATE = "{0:D6}";
        private const int OTP_EXPIRED_MIN = 5;

        private readonly IOTPRepository _oTPRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISmsService _smsService;

        public OTPService(IOTPRepository oTPRepository, 
            IMapper mapper, 
            IUnitOfWork unitOfWork,
            ISmsService smsService)
        {
            _oTPRepository = oTPRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _smsService = smsService;
        }

        public string CreatOTPWithEachPhone(string phoneNumber)
        {
            var newOTP = _oTPRepository.Get(x => x.PhoneNo.Equals(phoneNumber));

            //TODO: This will be changed when go into production
            Random generator = new Random();
            int rdom = generator.Next(1, 999998);
            string RandomNo = rdom.ToString("D6");
            if (newOTP == null)
            {
                newOTP = new OTP();
                newOTP.PhoneNo = phoneNumber;
                newOTP.Code = RandomNo;
                newOTP.ExpiredAtUTC = DateTime.UtcNow.AddMinutes(OTP_EXPIRED_MIN);
                _oTPRepository.Add(newOTP);
            }
            else
            {
                newOTP.Code = RandomNo;
                newOTP.ExpiredAtUTC = DateTime.UtcNow.AddMinutes(OTP_EXPIRED_MIN);
                _oTPRepository.Update(newOTP);
            }
            _unitOfWork.CommitChanges();

            _smsService.SendOTP(string.Format(OTP_TEMPLATE, RandomNo), phoneNumber);

            return RandomNo;
        }
    }
}
