import commonService from "../js/service/commonService.js";
import apiService from '../js/service/apiService.js';
import { appConfig } from "../constant/appConfig.js";
import TicketComponent from "../js/component/TicketComponent.js";
import CustomerComponent from "../js/component/CustomerComponent.js";
import toastService from "../js/service/toastService.js";

function routeDetail() {

    const id = {
        routeCode: 'route-code',
        ticketContainer: 'ticket-container',
        btnDelete: 'btn-delete',
        btnBuy: 'btn-buy',
        btnConfirm: 'btn-confirm',
        customerDetailContainer: 'customer-detail-container',
        customerDetailModal: 'customer-detail-modal',
        changeTicketModal: 'update-route-modal',
        changeTicketContainer: 'tickets-container',
        changeTicketEmpty: 'tickets-empty-container',
        btnUpdateRoute: 'btnUpdateRoute',
    };
    const elements = {
        customerDetailContainer: document.getElementById(id.customerDetailContainer),
        customerDetailModal: document.getElementById(id.customerDetailModal),
        routeCode: document.getElementById(id.routeCode),
        ticketContainer: document.getElementById(id.ticketContainer),
        btnDelete: document.getElementById(id.btnDelete),
        btnBuy: document.getElementById(id.btnBuy),
        btnConfirm: document.getElementById(id.btnConfirm),
        changeTicketContainer: document.getElementById(id.changeTicketContainer),
        availableTicketElements: [],
        btnUpdateRoute: document.getElementById(id.btnUpdateRoute),
        changeTicketEmpty: document.getElementById(id.changeTicketEmpty),
    };

    const routeId = commonService.getQueryParam('routeId');
    const customerComponent = new CustomerComponent(routeId);
    const model = {};
    const watchObj = commonService.createWatch({
        selectedAvailableTicketId: null,
    }, onWatchObjChanged);

    init();

    async function init() {
        model.route = await apiService.get(appConfig.apiUrl.route + routeId);

        renderRouteCode(model.route.code);
        renderTickets(model.route.routeTickets);
        const customerComponent = new CustomerComponent(model.route);

        elements.btnDelete.addEventListener('click', onBtnDeleteClicked);
        elements.btnBuy.addEventListener('click', onBtnBuyClicked);
        elements.btnConfirm.addEventListener('click', onBtnConfirmClicked);
        // customerComponent.domElement.addEventListener('click', function(e) {
        //     onBtnBuyClicked(model.route);
        // });
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

    async function onBtnConfirmClicked() {
        if(customerComponent.passengerDetail.passengerName === '' || customerComponent.passengerDetail.emailBooking === '') {
            toastService.error('Please input all field!');
        } else {
            const params = {
                routeId: routeId,
                passengerName: customerComponent.passengerDetail.passengerName,
                emailBooking: customerComponent.passengerDetail.emailBooking
            }
                try {
                    var response = await apiService.post(appConfig.apiUrl.route + 'buy-route/', params);
                    if(response.status === 200) {
                        // toastService.success('Buy route successfully!');
                        window.location.replace('/index.html');
                    } else {
                        toastService.error('error');
                    }
                } catch (ex) {
                    toastService.error('error');
                }
                
        }
    }

    async function onBtnBuyClicked() {
        await renderCustomerDetail(routeId);
    }

    function renderCustomerDetail(routeId) {
        commonService.removeAllChildren(elements.customerDetailContainer);
            // const customerComponent = new CustomerComponent(routeId);
            elements.customerDetailContainer.appendChild(customerComponent.render());
        $(`#${id.customerDetailModal}`).modal();
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