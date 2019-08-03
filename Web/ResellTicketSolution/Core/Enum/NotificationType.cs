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

        /// <summary>
        /// Notification Seller when staff payout
        /// </summary>
        TicketIsPayouted = 8,

        /// <summary>
        /// Ticket is revalid because of refund route 
        /// </summary>
        TicketIsRevalid = 9,

        /// <summary>
        /// Refund for buyer
        /// </summary>
        RouteIsRefunded = 10,

        /// <summary>
        /// Refund partial for buyer due to fail changing information of ticket
        /// </summary>
        RouteIsRefundedFailTicket = 11,

        /// <summary>
        /// Refund partial for buyer due to replace ticket.
        /// </summary>
        RouteIsRefundReplaceTicket = 12,

        /// <summary>
        /// Notify buyer when a ticket in route renamed failed
        /// </summary>
        RouteHasRenamedFailTicket = 13,
    }
}
