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
        List<TicketTypeRowViewModel> GetTicketType(string param);
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

        public List<TicketTypeRowViewModel> GetTicketType(string param)
        {
            param = param ?? "";

            var ticketTypes = _ticketTypeRepository.GetAllQueryable().
                Where(x => x.Name.ToLower().Contains(param.ToLower())).ToList();
            var ticketTypeReturn = _mapper.Map<List<TicketType>, List<TicketTypeRowViewModel>>(ticketTypes);

            return ticketTypeReturn;
        }

        public string UpdateTicketType(TicketTypeRowViewModel model)
        {
            var existedTicketType = _ticketTypeRepository.Get(x => x.Id == model.Id);
            if( existedTicketType == null)
            {
                return "Ticket Type Not Found";
            }
            if(model.Name != null && !model.Name.Equals(""))
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
