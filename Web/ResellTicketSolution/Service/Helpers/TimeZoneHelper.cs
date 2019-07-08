using System;

namespace Service.Helpers
{
    public static class TimeZoneHelper
    {
        /// <summary>
        /// Convert UTC time into local time
        /// </summary>
        /// <param name="time">DateTime param has DateTimeKind = UTC or Unspecified</param>
        /// <param name="timeZoneId">Time Zone destination</param>
        /// <returns></returns>
        public static DateTime ToLocalTime(this DateTime time, string timeZoneId = "UTC")
        {
            TimeZoneInfo tzi = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
            return TimeZoneInfo.ConvertTimeFromUtc(time, tzi);
        }

        /// <summary>
        /// Covnert time from local time into UTC time
        /// </summary>
        /// <param name="time"></param>
        /// <param name="timeZoneId"></param>
        /// <returns></returns>
        public static DateTime ToUTCTime(this DateTime time, string timeZoneId = "UTC")
        {
            TimeZoneInfo tzi = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
            return TimeZoneInfo.ConvertTimeToUtc(time, tzi);
        }

        /// <summary>
        /// Convert DateTime into specific timezoneId
        /// </summary>
        /// <param name="time"></param>
        /// <param name="sourceTimeZoneId">If null, auto convert from UTC</param>
        /// <param name="destinationTimeZoneId">If null, auto convert into UTC</param>
        /// <returns></returns>
        public static DateTime ToSpecifiedTimeZone(this DateTime time, string sourceTimeZoneId = "UTC", string destinationTimeZoneId = "UTC")
        {
            return TimeZoneInfo.ConvertTimeBySystemTimeZoneId(time, sourceTimeZoneId, destinationTimeZoneId);
        }

    }
}
