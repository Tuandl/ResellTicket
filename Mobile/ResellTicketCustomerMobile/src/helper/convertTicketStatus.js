const TicketStatus = {
    PENDING: 1,
    APPROVED: 2,
};

function toString(status) {
    switch(status) {
        case TicketStatus.PENDING: 
            return 'Pending';
        case TicketStatus.APPROVED:
            return 'Valid';
        default:
            return '';
    }
}

export default {
    ticketStatus: TicketStatus,
    toString: toString, 
}