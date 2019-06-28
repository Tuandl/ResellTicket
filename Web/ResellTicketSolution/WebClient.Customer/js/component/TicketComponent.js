import { appConfig } from '../../constant/appConfig.js';
import commonService from '../service/commonService.js';
import ticketStatus from '../enum/ticketStatus.js';


class TicketComponent {

    constructor(ticket) {
        this.ticket = ticket;
        this.html = document.createElement('div');
        this.html.id = ticket.id || commonService.generateRandomId();
    }

    renderStatus(status) {
        switch(status) {
            case ticketStatus.Pending:
                return `<span class="label label-warning">Pending</span>`;
            case ticketStatus.Valid:
                return `<span class="label label-success">Valid</span>`;
            case ticketStatus.Invalid:
                return `<span class="label label-danger">Invalid</span>`;
            case ticketStatus.Bought:
                return `<span class="label label-success">Bought</span>`;
            case ticketStatus.Renamed:
                return `<span class="label label-success">Renamed</span>`;
            case ticketStatus.Completed:
                return `<span class="label label-success">Completed</span>`;
        }
    }

    render() {

        const ticket = this.ticket;

        this.html.innerHTML =
            `<div class="margin-bottom-20">
                <div class="">
                    <h3 style="color: '#fab005'">
                        <span>${ticket.departureCityName}  </span>
                        <i class="fa fa-long-arrow-right"></i>
                        <span>  ${ticket.arrivalCityName}</span>
                    </h3>

                    <div class="route">
                        <input type="hidden" value=${ticket.ticketId} />
                        <div class="routeHeader">
                            <div class="col-md-3">
                                <h4><b>Ticket</b></h4>
                            </div>
                            <div class="col-md-2">
                                <h4><b>Departure</b></h4>
                            </div>
                            <div class="col-md-2">
                                <h4><b>Arrival</b></h4>
                            </div>
                            <div class="col-md-1">
                                <h4><b>Vehicle</b></h4>
                            </div>
                            <div class="col-md-2">
                                <h4><b>Status</b></h4>
                            </div>
                            <div class="col-md-2">
                                <h4><b>Price</b></h4>
                            </div>
                        </div>
                        <div class="routeBody" style="color: '#b8891d'">
                            <div class="col-md-3"><span><b>${ticket.ticketCode}</b></span></div>
                            <div class="col-md-2">
                                <span>${moment(ticket.departureDateTime).format(appConfig.format.datetime)}</span>
                            </div>
                            <div class="col-md-2">
                                <span>${moment(ticket.arrivalDateTime).format(appConfig.format.datetime)}</span>
                            </div>
                            <div class="col-md-1"><span>${ticket.vehicleName}</span></div>
                            <div class="col-md-2">${this.renderStatus(ticket.status)}</div>

                            <div class="col-md-2">
                                <h3>${numeral(ticket.sellingPrice).format('$0,0.00')}</h3>
                            </div>
                        </div>
                        <div class="routeFooter">
                            <span style="color: 'red'">Expired Date: ${moment(ticket.departureDateTime).format(appConfig.format.datetime)}</span>
                        </div>
                    </div>
                </div>
            </div>`;

        return this.html;
    }

    get domElement() {
        return this.html;
    }
}

export default TicketComponent