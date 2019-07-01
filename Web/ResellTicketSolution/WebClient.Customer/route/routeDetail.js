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
        changeTicketModal: 'update-route-modal',
        changeTicketContainer: 'tickets-container',
        changeTicketEmpty: 'tickets-empty-container',
        btnUpdateRoute: 'btnUpdateRoute',
    };
    const elements = {
        routeCode: document.getElementById(id.routeCode),
        ticketContainer: document.getElementById(id.ticketContainer),
        btnDelete: document.getElementById(id.btnDelete),
        btnBuy: document.getElementById(id.btnBuy),
        changeTicketContainer: document.getElementById(id.changeTicketContainer),
        availableTicketElements: [],
        btnUpdateRoute: document.getElementById(id.btnUpdateRoute),
        changeTicketEmpty: document.getElementById(id.changeTicketEmpty),
    };

    const routeId = commonService.getQueryParam('routeId');
    const model = {};
    const watchObj = commonService.createWatch({
        selectedAvailableTicketId: null,
    }, onWatchObjChanged);

    init();

    async function init() {
        model.route = await apiService.get(appConfig.apiUrl.route + routeId);

        renderRouteCode(model.route.code);
        renderTickets(model.route.routeTickets);

        elements.btnDelete.addEventListener('click', onBtnDeleteClicked);
        elements.btnBuy.addEventListener('click', onBtnBuyClicked);
        elements.btnUpdateRoute.addEventListener('click', onBtnUpdateRouteTicketClicked);
    }

    function renderRouteCode(routeCode) {
        commonService.removeAllChildren(elements.routeCode);
        elements.routeCode.innerHTML = routeCode;
    }

    function renderTickets(routeTickets) {
        commonService.removeAllChildren(elements.ticketContainer);
        routeTickets.forEach(routeTicket => {
            const ticketElement = new TicketComponent(routeTicket, onRouteTicketClicked);
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

    async function onRouteTicketClicked(component) {
        const routeTicket = component.ticket;
        model.selectedRouteTicketId = routeTicket.id;
        model.availableTickets = await apiService.get(appConfig.apiUrl.routeTicket + routeTicket.id + '/ticket');
        renderAvailableTickets(model.availableTickets);
        watchObj.selectedAvailableTicketId = null;

        if(model.availableTickets.length === 0) {
            elements.changeTicketEmpty.classList.remove('hidden');
        } else {
            elements.changeTicketEmpty.classList.add('hidden');
        }

        $(`#${id.changeTicketModal}`).modal();
    }

    function renderAvailableTickets(availableTickets) {
        elements.availableTicketElements.length = 0;
        commonService.removeAllChildren(elements.changeTicketContainer);
        
        availableTickets.forEach(ticket => {
            const ticketElement = new TicketComponent(ticket, onAvailableTicketClicked);
            elements.changeTicketContainer.appendChild(ticketElement.render());
            elements.availableTicketElements.push(ticketElement.html);
        });
    }

    function onAvailableTicketClicked(component) {
        elements.availableTicketElements.forEach(element => {
            element.classList.remove('ticket-available__active');
        });
        component.html.classList.add('ticket-available__active');
        watchObj.selectedAvailableTicketId = component.ticket.id;
    }

    function onWatchObjChanged(key) {
        switch(key) {
            case 'selectedAvailableTicketId' : renderUpdateRouteTicket()
        }
    }

    function renderUpdateRouteTicket() {
        if(watchObj.selectedAvailableTicketId) {
            elements.btnUpdateRoute.classList.remove('disabled');
        } else {
            elements.btnUpdateRoute.classList.add('disabled');
        }
    }

    async function onBtnUpdateRouteTicketClicked() {
        const params = {
            routeTicketId: model.selectedRouteTicketId,
            newTicketId: watchObj.selectedAvailableTicketId,
        };
        try {
            await apiService.put(appConfig.apiUrl.routeTicket, params);
            toastService.success('Update Route Ticket Successfully');
            $(`#${id.changeTicketModal}`).modal('hide');
            init();
        } 
        catch(ex) {
            console.log(ex);
            toastService.error('Cannot update Route Ticket');
        }
        
    }
}

routeDetail();