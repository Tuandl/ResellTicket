import ticketStatus from "../enum/ticketStatus.js";
import commonService from "../service/commonService.js";

export default class TicketFilterStatusComponent {
    model = {}
    event = {}
    
    constructor(currentStatus, onChangeStatus) {
        this.model.currentStatus = currentStatus;
        this.event.onChangeStatus = onChangeStatus;
        this.html = document.createElement('div');
    }

    render() {
        const btnAll = commonService.htmlToElement(`<button type="button" class="btn btn-info btn-lg ${this.model.currentStatus === ticketStatus.Pending ? 'active' : ''}">All</button>`);
        const btnBought = commonService.htmlToElement(`<button type="button" class="btn btn-info btn-lg ${this.model.currentStatus === ticketStatus.Bought ? 'active' : ''}">Bought</button>`);
        const btnRenamed = commonService.htmlToElement(`<button type="button" class="btn btn-info btn-lg ${this.model.currentStatus === ticketStatus.Renamed ? 'active' : ''}">Renamed</button>`);
        const btnCompleted = commonService.htmlToElement(`<button type="button" class="btn btn-info btn-lg ${this.model.currentStatus === ticketStatus.Completed ? 'active' : ''}">Completed</button>`);
        const self = this;

        btnAll.addEventListener('click', function() {
            self.event.onChangeStatus(ticketStatus.Pending)
        });

        btnBought.addEventListener('click', function() {
            self.event.onChangeStatus(ticketStatus.Bought)
        });

        btnRenamed.addEventListener('click', function() {
            self.event.onChangeStatus(ticketStatus.Renamed)
        });

        btnCompleted.addEventListener('click', function() {
            self.event.onChangeStatus(ticketStatus.Completed)
        });

        this.html = commonService.htmlToElement(`<div class="btn-group" ></div>`);
        this.html.appendChild(btnAll);
        this.html.appendChild(btnBought);
        this.html.appendChild(btnRenamed);
        this.html.appendChild(btnCompleted);

        return this.html;
    }

    domElement() {
        return this.html;
    };
}