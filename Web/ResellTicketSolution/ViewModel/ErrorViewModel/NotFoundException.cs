using System;

namespace ViewModel.ErrorViewModel
{
    public class NotFoundException : Exception
    {
        public NotFoundException() : base("Not Found.")
        {
        }
    }
}
