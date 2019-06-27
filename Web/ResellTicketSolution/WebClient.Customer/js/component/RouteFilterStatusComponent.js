import routeStatus from "../enum/routeStatus.js";
import commonService from "../service/commonService.js";

export default class RouteFilterStatusComponent {

    model = {}
    event = {}
    
    constructor(currentStatus, onChangeStatus) {
        this.model.currentStatus = currentStatus;
        this.event.onChangeStatus = onChangeStatus;
        this.html = document.createElement('div');
    }

    render() {
        const btnHistory = commonService.htmlToElement(`<button type="button" class="btn btn-info btn-lg ${this.model.currentStatus === routeStatus.New ? 'active' : ''}">History</button>`);
        const btnBought = commonService.htmlToElement(`<button type="button" class="btn btn-info btn-lg ${this.model.currentStatus === routeStatus.Bought ? 'active' : ''}">Bought</button>`);
        const btnCompleted = commonService.htmlToElement(`<button type="button" class="btn btn-info btn-lg ${this.model.currentStatus === routeStatus.Completed ? 'active' : ''}">Completed</button>`);
        const self = this;

        btnHistory.addEventListener('click', function() {
            self.event.onChangeStatus(routeStatus.New)
        });

        btnBought.addEventListener('click', function() {
            self.event.onChangeStatus(routeStatus.Bought)
        });

        btnCompleted.addEventListener('click', function() {
            self.event.onChangeStatus(routeStatus.Completed)
        });

        this.html = commonService.htmlToElement(`<div class="btn-group" ></div>`);
        this.html.appendChild(btnHistory);
        this.html.appendChild(btnBought);
        this.html.appendChild(btnCompleted);

        return this.html;
    }

    domElement() {
        return this.html;
    };
}