const TicketStatus = {
    PENDING: 1,
    VALID: 2,
    INVALID: 3,
    BOUGHT: 4,
    RENAMED: 5,
    COMPLETED: 6,
    REFUSED: 7
};

function toString(status) {
    switch (status) {
        case TicketStatus.PENDING:
            return 'Pending';
        case TicketStatus.VALID:
            return 'Valid';
        case TicketStatus.INVALID:
            return 'Invalid';
        case TicketStatus.BOUGHT:
            return 'Bought';
        case TicketStatus.RENAMED:
            return 'Renamed';
        case TicketStatus.COMPLETED:
            return 'Completed';
        case TicketStatus.REFUSED:
            return 'Refused';
        default:
            return '';
    }
}

export default {
    ticketStatus: TicketStatus,
    toString: toString,
}