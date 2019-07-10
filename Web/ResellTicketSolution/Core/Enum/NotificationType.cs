namespace Core.Enum
{
    public enum NotificationType
    {
        /// <summary>
        /// Notification Seller when staff confirm new posted ticket is valid
        /// </summary>
        TicketIsValid = 1,

        /// <summary>
        /// Notification Seller when his ticket is bought
        /// </summary>
        TicketIsBought = 2,

        /// <summary>
        /// Notification Seller when staff reject new posted ticket
        /// </summary>
        TicketIsReject = 3,

        /// <summary>
        /// Notification Seller when staff confirm this ticket is renamed successfully
        /// </summary>
        TicketIsConfirmedRenamed = 4,

        /// <summary>
        /// Notification Buyer when staff confirm bought ticket is renamed successfully
        /// </summary>
        TicketIsRenamed = 5,

        /// <summary>
        /// Notification Seller when staff verifies this ticket is not renamed
        /// </summary>
        TicketIsConfirmedRenamedFailed = 6,

        /// <summary>
        /// Notification Buyer when seller refuse renaming this ticket
        /// </summary>
        TicketIsRefuse = 7,
    }
}
