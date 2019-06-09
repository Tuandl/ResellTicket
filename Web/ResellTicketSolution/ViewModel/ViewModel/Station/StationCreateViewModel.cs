using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using Core.Enum;

namespace ViewModel.ViewModel.Station
{
    public class StationCreateViewModel
    {
        public int CityId { get; set; }

        public string Name { get; set; }
    }
}
