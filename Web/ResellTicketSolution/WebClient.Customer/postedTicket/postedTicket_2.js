import { appConfig } from '../constant/appConfig.js';
import apiService from '../js/service/apiService.js';
// import { authenticationService } from '../js/service/authenticationService.js';
import ticketStatus from '../js/enum/ticketStatus.js';
import commonService from '../js/service/commonService.js';
import SellerTicketComponent from '../js/component/SellerTicketComponent.js';
import TicketFilterStatusComponent from '../js/component/TicketFilterStatusComponent.js';

function postedTicketController() {
    const id = {
        ticketContainer: 'ticket-container',
        btnStatuses: 'btnStatuses',
        btnPostTicket: 'btnPostTicket',
    }

    const model = {
        page: 1,
        pageSize: 10,
        tickets: [],
        searchStatus: ticketStatus.Pending,
        ticketComponents: [],
    }

    bindEvent();
    renderBtnStatuses();
    renderTickets();

    function onStatusChanged(newStatus) {
        model.searchStatus = newStatus;
        renderBtnStatuses();
        renderTickets();
    }

    function renderBtnStatuses() {
        const container = document.getElementById(id.btnStatuses);
        commonService.removeAllChildren(container);
        const ticketFilterStatus = new TicketFilterStatusComponent(model.searchStatus, onStatusChanged);
        container.appendChild(ticketFilterStatus.render());
    }

    async function renderTickets() {
        const params = {
            page: model.page,
            pageSize: model.pageSize,
            status: model.searchStatus
        }

        const response = await apiService.get(appConfig.apiUrl.ticket, params);
        const containerElement = document.getElementById(id.ticketContainer);
        commonService.removeAllChildren(containerElement);

        response.forEach(ticket => {
            const ticketComponent = new SellerTicketComponent(ticket, onTicketClicked);
            model.ticketComponents.push(ticketComponent);

            ticketComponent.render();
            containerElement.appendChild(ticketComponent.domElement);
        });
    }

    function bindEvent() {
        var btnPostTicket = document.getElementById(id.btnPostTicket);
        btnPostTicket.addEventListener('click', function() {
            window.location.href = appConfig.url.ticket.postEditForm_2;
        });
    }

    function onTicketClicked(ticket) {
        window.location.href = appConfig.url.ticket.postEditForm_2 + '?ticketId=' + ticket.id;
    }
}

postedTicketController()