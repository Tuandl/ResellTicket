export default {
    /**
     * Notification Seller when staff confirm new posted ticket is valid
     */
    TicketIsValid: 1,

    /**
     * Notification Seller when his ticket is bought
     */
    TicketIsBought: 2,

    /**
     * Notification Seller when staff reject new posted ticket
     */
    TicketIsReject: 3,

    /**
     * Notification Seller when staff confirm this ticket is renamed successfully
     */
    TicketIsConfirmedRenamed: 4,

    /**
     * Notification Buyer when staff confirm bought ticket is renamed successfully
     */
    TicketIsRenamed: 5,

    /**
     * Notification Seller when staff verifies this ticket is not renamed
     */
    TicketIsConfirmedRenamedFailed: 6,

    /**
     * Notification Buyer when seller refuse renaming this ticket
     */
    TicketIsRefuse: 7,
}