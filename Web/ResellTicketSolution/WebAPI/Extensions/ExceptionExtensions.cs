using System;

namespace WebAPI.Extensions
{
    public static class ExceptionExtensions
    {
        /// <summary>
        /// Get The last inner exception for this exception
        /// </summary>
        /// <param name="ex"></param>
        /// <returns></returns>
        public static Exception GetRootException(this Exception ex)
        {
            while(ex.InnerException != null)
            {
                ex = ex.InnerException;
            }
            return ex;
        }
    }
}
