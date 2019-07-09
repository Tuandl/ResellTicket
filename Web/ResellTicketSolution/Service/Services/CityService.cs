using AutoMapper;
using Core.Infrastructure;
using Core.Models;
using Core.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using ViewModel.ViewModel.City;

namespace Service.Services
{
    public interface ICityService
    {
        bool CreateCity(CityRowViewModel model);
        List<CityRowViewModel> GetCities(string name, int ignoreCityId);
        CityDataTable GetCities(string name, int page, int pageSize);
        CityRowViewModel FindCityById(int id);
        string UpdateCity(CityUpdateViewModel model);
    }
    public class CityService : ICityService
    {
        private readonly ICityRepository _cityRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public CityService(ICityRepository cityRepository, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _cityRepository = cityRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }
        public bool CreateCity(CityRowViewModel model)
        {
            if (_cityRepository.Get(x => x.Name.Equals(model.Name)
             ) == null)
            {
                var city = new City();
                city.Name = model.Name;
                _cityRepository.Add(city);
                _unitOfWork.CommitChanges();

                return true;
            }
            return false;
        }

        //get city by param or get all cities when param = ""
        public List<CityRowViewModel> GetCities(string name, int ignoreCityId)
        {
            //select * from city
            //select * from city where name like '%abc%'

            name = name ?? "";
            var cities = _cityRepository.GetAllQueryable()
                         .Where(x => x.Name.ToLower().Contains(name.ToLower()));
            if(ignoreCityId != -1)
            {
                cities = cities.Where(x => x.Id != ignoreCityId);
            }
            var cityRowViewModels = _mapper.Map<List<City>, List<CityRowViewModel>>(cities.ToList());
            return cityRowViewModels;
        }

        public CityRowViewModel FindCityById(int id)
        {
            var city = _cityRepository.Get(x => x.Id == id);
            var cityRowViewModel = _mapper.Map<City, CityRowViewModel>(city);
            return cityRowViewModel;
        }

        public string UpdateCity(CityUpdateViewModel model)
        {
            var existedCity = _cityRepository.Get(x => x.Id == model.Id);
            if (existedCity == null)
            {
                return "Not found city";
            }

            existedCity.Name = model.Name;
            _cityRepository.Update(existedCity);
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

        public CityDataTable GetCities(string name, int page, int pageSize) //admin
        {
            name = name ?? "";
            var cities = new List<City>();
            if(page > 0 && pageSize > 0)
            {
                cities = _cityRepository.GetAllQueryable()
                         .Where(x => x.Name.ToLower().Contains(name.ToLower()))
                         .OrderBy(x => x.Name)
                         .Skip((page - 1) * pageSize).Take(pageSize).ToList();
            } else
            {
                cities = _cityRepository.GetAllQueryable()
                         .Where(x => x.Name.ToLower().Contains(name.ToLower()))
                         .OrderBy(x => x.Name).ToList();
            }
                         
            var totalCities = _cityRepository.GetAllQueryable()
                         .Where(x => x.Name.ToLower().Contains(name.ToLower())).Count();
            
            var cityRowViewModels = _mapper.Map<List<City>, List<CityRowViewModel>>(cities);
            var cityDataTable = new CityDataTable()
            {
                Data = cityRowViewModels,
                Total = totalCities
            };
            return cityDataTable;
        }
    }
}
