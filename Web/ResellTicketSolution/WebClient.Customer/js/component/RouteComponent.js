import { appConfig } from '../../constant/appConfig.js';
import commonService from '../service/commonService.js';
import routeStatus from '../enum/routeStatus.js';


class RouteComponent {

    constructor(route, onClicked) {
        this.route = route;
        this.html = document.createElement('div');
        this.html.id = route.id || commonService.generateRandomId();
        this.event = {
            onClicked
        };
    }

    renderStatus(status) {
        switch (status) {
            case routeStatus.New: 
                return `<span class="label label-warning">New</span>`;
            case routeStatus.Bought:
                return `<span class="label label-info">Bought</span>`;
            case routeStatus.Completed:
                return `<span class="label label-success">Completed</span>`;
        }
    }

    render() {

        this.html.innerHTML =
            `<div class="container margin-bottom-20">
            <div class="row">
                <h3 style="color: #fab005">
                    <span>${this.route.departureCityName}</span>
                    <i class="fa fa-long-arrow-right"></i>
                    <span>${this.route.arrivalCityName}</span>
                </h3>
            </div>
            </br>
            <div class="row">
                <div class="col-md-12 route">
                    <div class="routeHeader">
                        <div class="col-md-2">
                            <h4><b>Code</b></h4>
                        </div>
                        <div class="col-md-2">
                            <h4><b>Departure</b></h4>
                        </div>
                        <div class="col-md-2">
                            <h4><b>Arrival</b></h4>
                        </div>
                        <div class="col-md-2">
                            <h4><b>Amount</b></h4>
                        </div>
                        <div class="col-md-2">
                            <h4><b>Status</b></h4>
                        </div>
                        <div class="col-md-2">
                            <h4><b>Price</b></h4>
                        </div>
                    </div>
                    <div class="routeBody" style="color: #b8891d">
                        <div class="col-md-2"><span><b>${this.route.code || ''}</b></span></div>
                        <div class="col-md-2">
                            <span>${moment(this.route.departureDate).format(appConfig.format.datetime)}</span>
                        </div>
                        <div class="col-md-2">
                            <span>${moment(this.route.arrivalDate).format(appConfig.format.datetime)}</span>
                        </div>
                        <div class="col-md-2"><span>${this.route.ticketQuantity} tickets</span></div>
                        <div class="col-md-2">${this.renderStatus(this.route.status)}</div>
                        <div class="col-md-2"><h3>${numeral(this.route.totalAmount).format('$0,0.00')} $</h3></div>
                    </div>
                    <div class="routeFooter">
                        <span style="color: red">Expired Date: ${moment(this.route.departureDate).format(appConfig.format.datetime)}</span>
                    </div>
                </div>
            </div>
        </div>`;

        const self = this;
        this.html.addEventListener('click', function(e) {
            if(self.event.onClicked) {
                self.event.onClicked(self.route);
            }
        });
    }

    get domElement() {
        return this.html;
    }
}

export { RouteComponent }