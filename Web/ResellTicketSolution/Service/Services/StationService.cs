using AutoMapper;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using ViewModel.ViewModel.Station;

namespace Service.Services
{
    public interface IStationService
    {
        bool CreateStation(StationCreateViewModel model);
        StationDataTable GetStations(string param, int page, int pageSize);
        List<StationRowViewModel> GetStationsByCityId(int cityId, string name, int ignoreStationId);
        StationRowViewModel FindStationById(int id);
        string UpdateStation(StationUpdateViewModel model);
    }
    public class StationService : IStationService
    {
        private readonly ICityRepository _CityRepository;
        private readonly IStationRepository _StationRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public StationService(ICityRepository CityRepository, IStationRepository StationRepository, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _CityRepository = CityRepository;
            _StationRepository = StationRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }
        public bool CreateStation(StationCreateViewModel model)
        {
            if (_StationRepository.Get(x => x.Name.ToLower().Equals(model.Name.ToLower())
             ) == null)
            {
                var station = new Station();
                station.Name = model.Name;
                station.CityId = model.CityId;
                station.CreatedAtUTC = DateTime.UtcNow;
                _StationRepository.Add(station);
                _unitOfWork.CommitChanges();

                return true;
            }
            return false;
        }

        //get Station by param or get all stations when param = ""
        public StationDataTable GetStations(string param, int page, int pageSize)
        {
            //select * from Station
            //select * from Station where name like '%abc%'

            param = param ?? "";
            var stations = _StationRepository.GetAllQueryable()
                         .Where(x => x.Name.ToLower().Contains(param.ToLower()) || x.City.Name.Contains(param.ToLower()))
                         .OrderBy(x => x.City.Name.ToLower())
                         .Skip((page - 1) * pageSize).Take(pageSize)
                         .ToList();

            var totalStations = _StationRepository.GetAllQueryable()
                         .Where(x => x.Name.ToLower().Contains(param.ToLower()) || x.City.Name.Contains(param.ToLower())).Count();
            var StationRowViewModels = _mapper.Map<List<Station>, List<StationRowViewModel>>(stations);

            var stationDataTable = new StationDataTable()
            {
                Data = StationRowViewModels,
                Total = totalStations
            };
            return stationDataTable;
        }

        public List<StationRowViewModel> GetStationsByCityId(int cityId, string name, int ignoreStationId)
        {
            name = name ?? "";
            var stations = _StationRepository.GetAllQueryable()
               .Where(x => x.Name.ToLower().Contains(name.ToLower()))
               .Where(x => x.Deleted == false);
            if(cityId != -1)
            {
                stations = stations.Where(x => x.CityId == cityId);
            }
            if(ignoreStationId != -1)
            {
                stations = stations.Where(x => x.Id != ignoreStationId);
            }
            var stationRowViewModels = _mapper.Map<List<Station>, List<StationRowViewModel>>(stations.ToList());
            return stationRowViewModels;
        }

        public StationRowViewModel FindStationById(int id)
        {
            var Station = _StationRepository.Get(x => x.Id == id);
            var StationRowViewModel = _mapper.Map<Station, StationRowViewModel>(Station);
            return StationRowViewModel;
        }

        public string UpdateStation(StationUpdateViewModel model)
        {
            var existedStation = _StationRepository.Get(x => x.Id == model.Id);
            if (existedStation == null)
            {
                return "Not found Station";
            }

            existedStation.Name = model.Name;
            existedStation.CityId = model.CityId;
            _StationRepository.Update(existedStation);
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
