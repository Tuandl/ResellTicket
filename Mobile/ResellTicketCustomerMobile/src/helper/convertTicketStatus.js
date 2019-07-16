const TicketStatus = {
    PENDING: 1,
    VALID: 2,
    INVALID: 3,
    BOUGHT: 4,
    RENAMED: 5,
    COMPLETED: 6,
    RENAMEDSUCESS: 7,
    RENAMEDFAIL: 8,
    EXPIRED: 0,
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
            return 'RenamedSuccess';
        case TicketStatus.RENAMEDSUCESS:
            return 'RenamedSuccess';
        case TicketStatus.RENAMEDFAIL:
            return 'RenamedFail';
        default:
            return 'Expired';
    }
}

export default {
    ticketStatus: TicketStatus,
    toString: toString,
}