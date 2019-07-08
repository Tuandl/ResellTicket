using System;
using System.Collections.Generic;
using System.Linq;
using ViewModel.ViewModel.TimeZone;

namespace Service.Services
{
    public interface ITimeZoneService
    {
        List<TimeZoneOptionViewModel> GetAllTimeZoneOptions();
    }

    public class TimeZoneService : ITimeZoneService
    {
        public List<TimeZoneOptionViewModel> GetAllTimeZoneOptions()
        {
            var result = TimeZoneInfo.GetSystemTimeZones()
                .Select(timeZone => new TimeZoneOptionViewModel()
                {
                    Text = timeZone.DisplayName,
                    Value = timeZone.Id,
                });

            return result.ToList();
        }
    }
}
