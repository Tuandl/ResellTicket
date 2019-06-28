import commonService from "../js/service/commonService.js";
import apiService from '../js/service/apiService.js';
import { appConfig } from "../constant/appConfig.js";
import TicketComponent from "../js/component/TicketComponent.js";
import toastService from "../js/service/toastService.js";

function routeDetail() {

    const id = {
        routeCode: 'route-code',
        ticketContainer: 'ticket-container',
        btnDelete: 'btn-delete',
        btnBuy: 'btn-buy',
    };
    const elements = {
        routeCode: document.getElementById(id.routeCode),
        ticketContainer: document.getElementById(id.ticketContainer),
        btnDelete: document.getElementById(id.btnDelete),
        btnBuy: document.getElementById(id.btnBuy),
    };

    const routeId = commonService.getQueryParam('routeId');
    const model = {};

    init();

    async function init() {
        model.route = await apiService.get(appConfig.apiUrl.route + routeId);

        renderRouteCode(model.route.code);
        renderTickets(model.route.routeTickets);

        elements.btnDelete.addEventListener('click', onBtnDeleteClicked);
        elements.btnBuy.addEventListener('click', onBtnBuyClicked);
    }

    function renderRouteCode(routeCode) {
        commonService.removeAllChildren(elements.routeCode);
        elements.routeCode.innerHTML = routeCode;
    }

    function renderTickets(tickets) {
        commonService.removeAllChildren(elements.ticketContainer);
        tickets.forEach(ticket => {
            const ticketElement = new TicketComponent(ticket);
            elements.ticketContainer.appendChild(ticketElement.render());
        });
    }

    async function onBtnDeleteClicked() {
        await apiService.delete(appConfig.apiUrl.route + routeId);
        window.history.back();
    }

    function onBtnBuyClicked() {
        toastService.error('Not Support');
    }
}

routeDetail();