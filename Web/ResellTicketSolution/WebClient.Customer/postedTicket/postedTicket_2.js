import { appConfig } from '../constant/appConfig.js';
import apiService from '../js/service/apiService.js';
// import { authenticationService } from '../js/service/authenticationService.js';
import ticketStatus from '../js/enum/ticketStatus.js';
import commonService from '../js/service/commonService.js';
import SellerTicketComponent from '../js/component/SellerTicketComponent.js';
import TicketFilterStatusComponent from '../js/component/TicketFilterStatusComponent.js';
import toastService from '../js/service/toastService.js';

function postedTicketController() {
    const id = {
        ticketContainer: 'ticket-container',
        btnStatuses: 'btnStatuses',
        btnPostTicket: 'btnPostTicket',
        btnLoadMore: 'btnLoadMore',
        showEmptyList: 'show-empty-list',
        connectToStripeLinkId: 'connect-to-stripe-link',
        linkConnectToStripe: 'linkConnectToStripe'
    }

    const model = {
        page: 1,
        pageSize: 5,
        tickets: [],
        searchStatus: ticketStatus.Pending,
        ticketComponents: [],
        total: 0
    }


    bindEvent();
    renderBtnStatuses();
    renderTickets();

    function onStatusChanged(newStatus) {
        model.total = 0;
        model.page = 1;
        model.searchStatus = newStatus;
        model.isLoadAll = false;
        renderBtnStatuses();
        commonService.removeAllChildren(document.getElementById(id.ticketContainer));
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
        //commonService.removeAllChildren(containerElement);

        response.forEach(ticket => {
            const ticketComponent = new SellerTicketComponent(ticket, onTicketClicked);
            model.ticketComponents.push(ticketComponent);

            ticketComponent.render();
            containerElement.appendChild(ticketComponent.domElement);
        });
        model.total += response.length;
        if(model.total === 0){
            document.getElementById(id.showEmptyList).style.display = 'block';  
        } else {
            document.getElementById(id.showEmptyList).style.display = 'none';
        }
        if(response.length !== model.pageSize) {
            model.isLoadAll = true;
            commonService.removeAllChildren(document.getElementById(id.btnLoadMore))
        }
        
        model.isLoadingMore = false;
    }

    function bindEvent() {
        const linkElement = document.getElementById(id.connectToStripeLinkId);
        var btnPostTicket = document.getElementById(id.btnPostTicket);
        btnPostTicket.addEventListener('click', function () {
            if(linkElement.href === appConfig.bankConnect.linkCreate) {
                toastService.error('Please connect to Stripe account that we can tranfer money.')
            } else {
                window.location.href = appConfig.url.postedTicket.postEditForm_2;
            }
        });

        $(window).scroll(function() {
            if($(window).scrollTop() + $(window).height() >= ($(document).height() - $('.footer').height())) {
                if(!model.isLoadAll && !model.isLoadingMore) {
                    model.isLoadingMore = true;
                    model.page += 1;
                    renderTickets();
                } 
            }
        });  
    }

    function onTicketClicked(ticket) {
        window.location.href = appConfig.url.postedTicket.postEditForm_2 + '?ticketId=' + ticket.id;
    }
}

postedTicketController()