using System.Collections.Generic;

namespace ViewModel.ViewModel
{
    public abstract class DataTableBase <T> where T : class
    {
        public List<T> Data { get; set; }
        public int Total { get; set; }
    }
}
