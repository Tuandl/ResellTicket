using AutoMapper;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ViewModel.ViewModel.Transportation;

namespace Service.Services
{
    public interface ITransportationService
    {
        bool CreateTransportation(TransportationCreateViewModel transportation);
        List<TransportationRowViewModel> GetTransportations(string param);
        List<TransportationRowViewModel> GetTransportationsByVehicleId(int vehicleId);
        TransportationRowViewModel FindTransportationById(int id);
        string UpdateTransportation(TransportationUpdateViewModel model);
        string DeleteTransportation(TransportationUpdateViewModel model);
    }
    public class TransportationService : ITransportationService
    {
        private readonly ITransportationRepository _transportationRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public TransportationService(ITransportationRepository transportationRepository, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _transportationRepository = transportationRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }
        public bool CreateTransportation(TransportationCreateViewModel model)
        {
            if (_transportationRepository.Get(x => 
                    x.Name.Equals(model.Name, StringComparison.Ordinal) && x.VehicleId == model.VehicleId) == null)
            {
                var transportation = _mapper.Map<TransportationCreateViewModel, Transportation>(model);
                transportation.CreatedAt = DateTime.Now;
                transportation.UpdatedAt = DateTime.Now;
                transportation.Deleted = false;
                _transportationRepository.Add(transportation);
                _unitOfWork.CommitChanges();
                return true;
            }
            return false;
        }

        public List<TransportationRowViewModel> GetTransportationsByVehicleId(int vehicleId)
        {
            var transportation = _transportationRepository.GetAllQueryable()
                .Where(x => x.VehicleId == vehicleId).ToList();
            var transportationRowVMs = _mapper.Map<List<Transportation>,
                                     List<TransportationRowViewModel>>(transportation);
            return transportationRowVMs;
        }

        public TransportationRowViewModel FindTransportationById(int id)
        {
            var trans = _transportationRepository.Get(x => x.Id.Equals(id));
            var transportationRowViewModel = _mapper.Map<Transportation, TransportationRowViewModel>(trans);
            return transportationRowViewModel;
        }

        public List<TransportationRowViewModel> GetTransportations(string param)
        {
            param = param ?? "";
            var Transportations = _transportationRepository.GetAllQueryable().Where(x => 
                            x.Name.ToUpper().Contains(param.ToUpper())).ToList();
            var TransportationRowView = _mapper.Map<List<Transportation>, List<TransportationRowViewModel>>(Transportations);
            return TransportationRowView;
        }

        public string UpdateTransportation(TransportationUpdateViewModel model)
        {
            var existedTranportation = _transportationRepository.Get(x => x.Id == model.Id);
            if (existedTranportation == null)
            {
                return "Not found Transportation";
            }

            if (model.Name != null && model.Name != "")
            {
                existedTranportation.Name = model.Name;
            }
            if (model.PhoneNumber != null && model.PhoneNumber != "")
            {
                existedTranportation.PhoneNumber = model.PhoneNumber;
            }
            if (model.Email != null && model.Email != "")
            {
                existedTranportation.Email = model.Email;
            }
            if (model.VehicleId.ToString() != null && model.VehicleId.ToString() != "")
            {
                existedTranportation.VehicleId = model.VehicleId;
            }
            

            existedTranportation.UpdatedAt = DateTime.Now;
            _transportationRepository.Update(existedTranportation);
            try
            {
                _unitOfWork.CommitChanges();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

            return string.Empty;
            
        }
        public string DeleteTransportation(TransportationUpdateViewModel model)
        {
            var existedTranportation = _transportationRepository.Get(x => x.Id == model.Id);
            if (existedTranportation == null)
            {
                return "Not found Transportation";
            }

            _transportationRepository.Delete(existedTranportation);
            try
            {
                _unitOfWork.CommitChanges();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

            return string.Empty;

        }
    }
}
