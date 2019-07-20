import { appConfig } from '../../constant/appConfig.js';
import commonService from '../service/commonService.js';
import ticketStatus from '../enum/ticketStatus.js';
import vehicleNameEnum from '../enum/vehicleNameEnum.js';

class SellerTicketComponent {

    constructor(ticket, onClicked) {
        this.ticket = ticket;
        this.events = {
            onClicked,
        }
        this.html = document.createElement('div');
        this.html.id = ticket.id || commonService.generateRandomId();
        this.id = this.html.id;
    }

    renderStatus(status) {
        switch (status) {
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
                // return `<span class="label label-success">Completed</span>`;
                return `<span class="label label-success">RenamedSuccess</span>`;
            case ticketStatus.RenamedSuccess:
                return `<span class="label label-success">RenamedSuccess</span>`;
            case ticketStatus.RenamedFail:
                return `<span class="label label-danger">RenamedFail</span>`;
            default:
                return `<span class="label label-default">Expired</span>`;
        }
    }

    renderVehicleIcon(vehicle) {
        switch (vehicle) {
            case vehicleNameEnum.PLANE:
                return `<i class="fa fa-plane ticket-component__iconVehicle" aria-hidden="true"></i>`;
            case vehicleNameEnum.BUS:
                return `<i class="fa fa-bus ticket-component__iconVehicle" aria-hidden="true"></i>`;
            case vehicleNameEnum.TRAIN:
                return `<i class="fa fa-subway ticket-component__iconVehicle" aria-hidden="true"></i>`;
        }
    }

    render() {
        const ticket = this.ticket;
        if ((ticket.status === ticketStatus.Pending ||
            ticket.status === ticketStatus.Valid ||
            ticket.status === ticketStatus.Bought) 
            && moment(new Date()).isAfter(ticket.expiredDateTime)) {
            ticket.status = 0
        }
        this.html.innerHTML =
            `<div class="row" style="margin-bottom: 50px">
                <h3 style="color: #fab005">
                    <span>${ticket.departureCityName}  </span>
                    <i class="fa fa-long-arrow-right"></i>
                    <span>  ${ticket.arrivalCityName}</span>
                </h3>

                <div class="col-md-12 route">
                    <input type="hidden" value=${ticket.Id} />
                    <div class="routeHeader">
                        <div class="col-md-2">
                            <h4><b>Ticket</b></h4>
                        </div>
                        <div class="col-md-2">
                            <h4><b>Departure</b></h4>
                        </div>
                        <div class="col-md-2">
                            <h4><b>Arrival</b></h4>
                        </div>
                        <div class="col-md-2">
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
                        <div class="col-md-2"><span><b>${ticket.ticketCode}</b></span></div>
                        <div class="col-md-2">
                            <span>${moment(ticket.departureDateTime).format(appConfig.format.datetime)}</span>
                        </div>
                        <div class="col-md-2">
                            <span>${moment(ticket.arrivalDateTime).format(appConfig.format.datetime)}</span>
                        </div>
                        <div class="col-md-2"><span>${ticket.vehicle}</span></div>
                        <div class="col-md-2">${this.renderStatus(ticket.status)}</div>

                        <div class="col-md-2">
                            <h3>${numeral(ticket.sellingPrice).format('$0,0.00')}</h3>
                        </div>
                    </div>
                    <div class="routeFooter">
                        <span style="color: red">Expired Date: ${moment(ticket.expiredDateTime).format(appConfig.format.datetime)}</span>
                    </div>
                </div>
            </div>`;

        this.bindEvents();

        return this.html;
    }

    get domElement() {
        return this.html;
    }

    bindEvents() {
        const self = this;
        if (this.events.onClicked) {
            this.html.addEventListener('click', function () {
                self.events.onClicked(self);
            });
        }
    }
}

export default SellerTicketComponent