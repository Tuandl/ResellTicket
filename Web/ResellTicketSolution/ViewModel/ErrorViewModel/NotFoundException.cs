using System;

namespace ViewModel.ErrorViewModel
{
    public class NotFoundException : Exception
    {
        public NotFoundException(string message) : base(message)
        {

        }

        public NotFoundException() : base("Not Found.")
        {
        }
    }
}
