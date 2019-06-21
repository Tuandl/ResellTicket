namespace Core.Enum
{
    /// <summary>
    /// Route status
    /// </summary>
    public enum RouteStatus
    {
        /// <summary>
        /// Customer only clicked into route
        /// </summary>
        New = 1,

        /// <summary>
        /// Customer clicked Buy buy button
        /// </summary>
        Bought = 2,

        /// <summary>
        /// All tickets in route are rename successfully
        /// </summary>
        Completed = 3,
    }
}
