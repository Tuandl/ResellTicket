import { appConfig } from '../../constant/appConfig.js';
import commonService from '../service/commonService.js';
import ticketStatus from '../enum/ticketStatus.js';
import vehicleNameEnum from '../enum/vehicleNameEnum.js';

class TicketComponent {

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
                return `<span class="label label-success">Completed</span>`;
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

        this.html.innerHTML =
            `<div class="margin-bottom-20">
                <div class="">
                    <h3 style="color: '#fab005'">
                        <div class="row margin-top-20 margin-bottom-20">
                            <div class="col-sm-5 text-center">
                                <div>${ticket.departureCityName}</div>
                                <div class="ticket-component__stationName">${ticket.departureStationName}</div>
                            </div>
                            <div class="col-sm-1 text-center">
                                ${this.renderVehicleIcon(ticket.vehicle)}
                            </div>
                            <div class="col-sm-5 text-center">
                                <div>${ticket.arrivalCityName}</div>
                                <div class="ticket-component__stationName">${ticket.arrivalStationName}</div>
                            </div>
                        </div>
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
                            <div class="col-md-2">
                                <h4><b>Transportation</b></h4>
                            </div>
                            <div class="col-md-1">
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
                            <div class="col-md-2"><span>${ticket.transportationName}</span></div>
                            <div class="col-md-1">${this.renderStatus(ticket.status)}</div>

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

export default TicketComponent