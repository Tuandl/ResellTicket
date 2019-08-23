import commonService from "../js/service/commonService.js";
import apiService from '../js/service/apiService.js';
import { appConfig } from "../constant/appConfig.js";
import TicketComponent from "../js/component/TicketComponent.js";
import CustomerComponent from "../js/component/CustomerComponent.js";
import toastService from "../js/service/toastService.js";
import { ConfirmDialogDeleteRouteDetail } from '../js/component/dialogComponent/ConfirmDialogDeleteRouteDetail.js';
import { ConfirmDialogConfirmBuyerDetail } from '../js/component/dialogComponent/ConfirmDialogConfirmBuyerDetail.js';
import routeStatus from '../js/enum/routeStatus.js';
import ticketStatus from "../js/enum/ticketStatus.js";

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
        //Confirm dialog
        dialogDeleteRouteDetail: 'dialog-delete-route-detail',
        dialogConfirmBuyerDetail: 'dialog-confirm-buyer-detail'
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
        dialogDeleteRouteDetail: document.getElementById(id.dialogDeleteRouteDetail),
        dialogConfirmBuyerDetail: document.getElementById(id.dialogConfirmBuyerDetail),
    };

    var notValidTicketCount = 0;
    const routeId = commonService.getQueryParam('routeId');
    const customerComponent = new CustomerComponent(routeId);
    const model = {};
    const watchObj = commonService.createWatch({
        selectedAvailableTicketId: null,
    }, onWatchObjChanged);

    const modelConfirmDialog = {
        dialogDeleteRouteDetailBox: [],
        dialogConfirmBuyerDetailBox: []
    }

    init();
    initConfirmDialog();

    async function init() {
        model.route = await apiService.get(appConfig.apiUrl.route + routeId);

        renderRouteCode(model.route.code);
        renderTickets(model.route.routeTickets);
        const customerComponent = new CustomerComponent(model.route);

        if(model.route.status === routeStatus.New && notValidTicketCount === 0) {
            elements.btnBuy.style.display = 'inline';
            elements.btnBuy.addEventListener('click', onBtnBuyClicked);
            elements.btnConfirm.addEventListener('click', onBtnConfirmClicked);
            elements.btnUpdateRoute.addEventListener('click', onBtnUpdateRouteTicketClicked);
        }
        if(model.route.status != routeStatus.Bought) {
            elements.btnDelete.style.display = 'inline';
            elements.btnDelete.addEventListener('click', showConfirmDialogDeleteRouteDetail);
            
        }
        
        //elements.btnDelete.addEventListener('click', onBtnDeleteClicked);
        // customerComponent.domElement.addEventListener('click', function(e) {
        //     onBtnBuyClicked(model.route);
        // });
    }

    function initConfirmDialog() {
        commonService.removeAllChildren(elements.dialogDeleteRouteDetail);
        commonService.removeAllChildren(elements.dialogConfirmBuyerDetail);
        //
        const confirmDialogDeleteRouteDetail = new
        ConfirmDialogDeleteRouteDetail("Delete Route", "Do you want to delete this Route ?",
                "Delete", showConfirmDialogDeleteRouteDetail, onBtnDeleteClicked);
        modelConfirmDialog.dialogDeleteRouteDetailBox.push(confirmDialogDeleteRouteDetail);
        confirmDialogDeleteRouteDetail.render();
        elements.dialogDeleteRouteDetail.appendChild(confirmDialogDeleteRouteDetail.domElement);
        //
        const confirmDialogConfirmBuyerDetail = new
        ConfirmDialogConfirmBuyerDetail("Confirm And Buy Route", "Do you want to buy this route and confirm your information ?",
                "Confirm", onBtnConfirmClickedCallApi);
        modelConfirmDialog.dialogConfirmBuyerDetailBox.push(confirmDialogConfirmBuyerDetail);
        confirmDialogConfirmBuyerDetail.render();
        elements.dialogConfirmBuyerDetail.appendChild(confirmDialogConfirmBuyerDetail.domElement);
    }

    function showConfirmDialogDeleteRouteDetail() {
        $('#delete-route-detail').modal();
    }

    function showConfirmDialogConfirmBuyerDetail() {
        $('#confirm-buyer-detail').modal();
    }


    function renderRouteCode(routeCode) {
        commonService.removeAllChildren(elements.routeCode);
        elements.routeCode.innerHTML = routeCode;
    }

    function renderTickets(routeTickets) {
        commonService.removeAllChildren(elements.ticketContainer);
        routeTickets.forEach(routeTicket => {
            if(routeTicket.status !== ticketStatus.Valid) {
                notValidTicketCount++;
            }
            const ticketElement = new TicketComponent(routeTicket, onRouteTicketClicked, model.route.status);
            elements.ticketContainer.appendChild(ticketElement.render());
        });
    }

    async function onBtnDeleteClicked() {
        await apiService.delete(appConfig.apiUrl.route + routeId);
        window.location.href = appConfig.url.home;
    }

    function onBtnConfirmClicked() {
        if (customerComponent.passengerDetail.buyerPassengerName === ''
            || customerComponent.passengerDetail.buyerPassengerEmail === ''
            || customerComponent.passengerDetail.buyerPassengerPhone === ''
            || customerComponent.passengerDetail.buyerPassengerIdentify === '') {
            toastService.error('Please input all field!');
        } else {
            showConfirmDialogConfirmBuyerDetail();
        }
    }

    async function onBtnConfirmClickedCallApi() {
        // window.location.replace('/index.html');
        const params = {
            routeId: routeId,
            buyerPassengerName: customerComponent.passengerDetail.buyerPassengerName,
            buyerPassengerEmail: customerComponent.passengerDetail.buyerPassengerEmail,
            buyerPassengerPhone: customerComponent.passengerDetail.buyerPassengerPhone,
            buyerPassengerIdentify: customerComponent.passengerDetail.buyerPassengerIdentify
        }
        try {
            var routeResponse = await apiService.post(appConfig.apiUrl.route + 'buy-route/', params);
            if (routeResponse.status === 200) {
                toastService.success('Buy route successfully!');
                window.location.replace('/index.html');
            } else {
                toastService.error('This Route has been bought. Please buy another route.');
            }
        } catch (ex) {
            toastService.error('This Route has been bought. Please buy another route.');
        }
        //window.location.replace(appConfig.url.route.searchForm);
    }

    async function onBtnBuyClicked() {
        const param = {
            id: localStorage.getItem('ID')
        }
        var creditCards = await apiService.get(appConfig.apiUrl.creditCard, param);
        if(creditCards.length === 0) {
            toastService.error('Please add a credit card');
            window.location.replace(appConfig.url.creditCard.createCreditCard);
        } else {
            await renderCustomerDetail(routeId);
        }
        //
    }

    async function renderCustomerDetail(routeId) {
        commonService.removeAllChildren(elements.customerDetailContainer);
        // const customerComponent = new CustomerComponent(routeId);
        elements.customerDetailContainer.appendChild(customerComponent.render());
        await customerComponent.AutoFillCustomerDetail();
        $(`#${id.customerDetailModal}`).modal();
    }

    async function onRouteTicketClicked(component) {
        const routeTicket = component.ticket;

        if(model.route.status !== routeStatus.New) {
            return;
        }
        model.selectedRouteTicketId = routeTicket.id;
        model.availableTickets = await apiService.get(appConfig.apiUrl.routeTicket + routeTicket.id + '/ticket');
        renderAvailableTickets(model.availableTickets);
        watchObj.selectedAvailableTicketId = null;

        if (model.availableTickets.length === 0) {
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
            const ticketElement = new TicketComponent(ticket, onAvailableTicketClicked, model.route.status);
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
        switch (key) {
            case 'selectedAvailableTicketId': renderUpdateRouteTicket()
        }
    }

    function renderUpdateRouteTicket() {
        if (watchObj.selectedAvailableTicketId) {
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
        catch (ex) {
            console.log(ex);
            toastService.error('Cannot update Route Ticket');
        }

    }
}

routeDetail();