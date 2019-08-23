import RouteStatus from '../constants/routeStatus';

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
            return 'Payout';
        case TicketStatus.RENAMEDSUCESS:
            return 'Renamed Success';
        case TicketStatus.RENAMEDFAIL:
            return 'Renamed Fail';
        default:
            return 'Expired';
    }
}

function toBuyer(status, isRefunded, routeStatus) {
    switch (status) {
        case TicketStatus.PENDING:
            return 'Pending';
        case TicketStatus.VALID:
            return 'Valid';
        case TicketStatus.INVALID:
            return 'Invalid';
        case TicketStatus.BOUGHT:
            if (routeStatus === RouteStatus.NEW) return 'Not Available'
            return 'Bought';
        case TicketStatus.RENAMED:
            if (routeStatus === RouteStatus.NEW) return 'Not Available'
            return 'Renamed';
        case TicketStatus.COMPLETED:
            if (routeStatus === RouteStatus.NEW) return 'Not Available'
            return 'Renamed Success';
        case TicketStatus.RENAMEDSUCESS:
            if (routeStatus === RouteStatus.NEW) return 'Not Available'
            return 'Renamed Success';
        case TicketStatus.RENAMEDFAIL:
            if (routeStatus === RouteStatus.NEW) return 'Not Available'
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