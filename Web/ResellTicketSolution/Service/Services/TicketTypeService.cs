using AutoMapper;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ViewModel.ViewModel.TicketType;

namespace Service.Services
{
    public interface ITicketTypeService
    {
        bool CreateTicketType(TicketTypeCreateViewModel model);
        TickeTypeDataTable GetTicketType(string param, int page, int pageSize);
        List<TicketTypeRowViewModel> GetTicketTypesByVehicleId(int vehicleId, string ticketTypeName);
        TicketTypeRowViewModel FindTicketTypeById(int id);
        string UpdateTicketType(TicketTypeRowViewModel model);
    }

    public class TicketTypeService : ITicketTypeService
    {
        private readonly ITicketTypeRepository _ticketTypeRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public TicketTypeService(ITicketTypeRepository ticketTypeRepository, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _ticketTypeRepository = ticketTypeRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        public bool CreateTicketType(TicketTypeCreateViewModel model)
        {
            var ticketType = _mapper.Map<TicketTypeCreateViewModel, TicketType>(model);
            if (_ticketTypeRepository.Get(x => x.Name.Equals(model.Name, StringComparison.OrdinalIgnoreCase)) == null)
            {
                ticketType.CreatedAt = DateTime.Now;
                ticketType.UpdatedAt = DateTime.Now;
                _ticketTypeRepository.Add(ticketType);
                _unitOfWork.CommitChanges();
                return true;
            }
            return false;
        }

        public TicketTypeRowViewModel FindTicketTypeById(int id)
        {
            var ticketType = _ticketTypeRepository.Get(x => x.Id == id);
            var ticketTypeRow = _mapper.Map<TicketType, TicketTypeRowViewModel>(ticketType);
            return ticketTypeRow;
        }
        public List<TicketTypeRowViewModel> GetTicketTypesByVehicleId(int vehicleId, string ticketTypeName)
        {
            ticketTypeName = ticketTypeName ?? "";
            List<TicketType> ticketTypes = null;
            if (vehicleId == -1)
            {
                ticketTypes = _ticketTypeRepository.GetAllQueryable()
                   .Where(x => x.Name.ToLower().Contains(ticketTypeName.ToLower()))
                   .Where(x => x.Deleted == false)
                   .ToList();
            }
            else
            {
                ticketTypes = _ticketTypeRepository.GetAllQueryable()
                .Where(x => x.VehicleId == vehicleId)
                .Where(x => x.Name.ToLower().Contains(ticketTypeName.ToLower()))
                .Where(x => x.Deleted == false)
                .ToList();
            }
            var ticketTypeRowVMs = _mapper.Map<List<TicketType>, List<TicketTypeRowViewModel>>(ticketTypes);
            return ticketTypeRowVMs;
        }
        public TickeTypeDataTable GetTicketType(string param, int page, int pageSize)
        {
            param = param ?? "";

            var ticketTypes = _ticketTypeRepository.GetAllQueryable()
                .Where(x => x.Name.ToLower().Contains(param.ToLower()))
                .Where(x => x.Deleted == false)
                .OrderBy(x => x.Vehicle.Name.ToLower())
                 .Skip((page - 1) * pageSize).Take(pageSize).ToList();
            var totalTicketTypes = _ticketTypeRepository.GetAllQueryable()
                .Where(x => x.Name.ToLower().Contains(param.ToLower()))
                .Where(x => x.Deleted == false).Count();
            var ticketTypeReturn = _mapper.Map<List<TicketType>, List<TicketTypeRowViewModel>>(ticketTypes);
            var ticketTypeDataTable = new TickeTypeDataTable()
            {
                Data = ticketTypeReturn,
                Total = totalTicketTypes
            };
            return ticketTypeDataTable;
        }

        public string UpdateTicketType(TicketTypeRowViewModel model)
        {
            var existedTicketType = _ticketTypeRepository.Get(x => x.Id == model.Id);
            if (existedTicketType == null)
            {
                return "Ticket Type Not Found";
            }
            if (model.Name != null && !model.Name.Equals(""))
            {
                existedTicketType.Name = model.Name;
            }

            if (model.VehicleId.ToString() != null && !model.VehicleId.Equals(""))
            {
                existedTicketType.VehicleId = model.VehicleId;
            }
            existedTicketType.UpdatedAt = DateTime.Now;
            _ticketTypeRepository.Update(existedTicketType);
            _unitOfWork.CommitChanges();

            return string.Empty;
        }
    }
}
