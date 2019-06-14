﻿using AutoMapper;
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
        List<StationRowViewModel> GetStations(string param);
        List<StationRowViewModel> GetStationsByCityId(int cityId);
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
                station.CreatedAt = DateTime.UtcNow;
                _StationRepository.Add(station);
                _unitOfWork.CommitChanges();

                return true;
            }
            return false;
        }

        //get Station by param or get all stations when param = ""
        public List<StationRowViewModel> GetStations(string param)
        {
            //select * from Station
            //select * from Station where name like '%abc%'

            param = param ?? "";
            var stations = _StationRepository.GetAllQueryable()
                         .Where(x => x.Name.ToLower().Contains(param.ToLower()) || x.City.Name.Contains(param.ToLower())).ToList();
            var StationRowViewModels = _mapper.Map<List<Station>, List<StationRowViewModel>>(stations);
            //foreach(var station in StationRowViewModels)
            //{
            //    station.CityName = _CityRepository.GetAllQueryable().SingleOrDefault(c => c.Id == station.CityId).Name;
            //}
            return StationRowViewModels;
        }

        public List<StationRowViewModel> GetStationsByCityId(int cityId)
        {
            var stations = _StationRepository.GetAllQueryable()
                .Where(x => x.CityId == cityId).ToList();
            var stationRowViewModels = _mapper.Map<List<Station>, List<StationRowViewModel>>(stations);
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