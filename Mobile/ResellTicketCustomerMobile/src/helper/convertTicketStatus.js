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

function toSeller(status) {
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
            return 'Renamed Success';
        case TicketStatus.RENAMEDSUCESS:
            return 'Renamed Success';
        case TicketStatus.RENAMEDFAIL:
            return 'Renamed Fail';
        default:
            return 'Expired';
    }
}

function toBuyer(status, isRefunded) {
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
            return 'Payout';
        case TicketStatus.RENAMEDSUCESS:
            return 'Renamed Success';
        case TicketStatus.RENAMEDFAIL:
            return isRefunded ? 'Refunded' : 'Renamed Fail';
        default:
            return 'Expired';
    }
}

export default {
    ticketStatus: TicketStatus,
    toBuyer: toBuyer,
    toSeller: toSeller
}