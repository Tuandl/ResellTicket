import { authenticationService } from "../service/authenticationService.js";
import { appConfig } from "../../constant/appConfig.js";
import commonService from "../service/commonService.js";
import apiService from "../service/apiService.js";

export default class NavigationComponent {
    
    containerId = 'nav-bar-container';
    connectToStripeLinkId = 'connect-to-stripe-link';
    linkConnectToStripe = 'linkConnectToStripe'

    navBarGroup = {
        route: 1,
        postTicket: 2,
        creditCard: 3,
        connectToStripe: 4,
        transaction: 5,
    }

    constructor(containerId) {
        if(containerId) {
            this.containerId = containerId;
        }

        this.container = document.getElementById(this.containerId);
    }

    render() {
        if(this.container == null)
            return;

        if(authenticationService.isLogedin()) {
            this.renderLoginedNavbar();
        } else {
            // this.renderAnnonymousNavbar();
        }
    }

    renderLoginedNavbar() {
        const navBarStr = `
            <nav class="navbar navbar-default">
                <div class="collapse navbar-collapse" id="bs-megadropdown-tabs">
                    <ul class="nav navbar-nav ">
                        <li class="${this.isCurrentGroup(this.navBarGroup.route) ? 'active' : ''}">
                            <a href="${appConfig.url.home}" class="hyper"><span>Find Tickets</span></a>
                        </li>
                        <li class="${this.isCurrentGroup(this.navBarGroup.postTicket) ? 'active' : ''}">
                            <a href="${appConfig.url.postedTicket.postedTicketList}" class="hyper"><span>Sell Tickets</span></a>
                        </li>
                        <li class="${this.isCurrentGroup(this.navBarGroup.creditCard) ? 'active' : ''}">
                            <a href="${appConfig.url.creditCard.viewListCreditCard}" class="hyper"><span>Payment methods</span></a>
                        </li>
                        <li id="btn-reload" class="${this.isCurrentGroup(this.navBarGroup.connectToStripe) ? 'active' : ''}">
                            <a id="${this.connectToStripeLinkId}" class="hyper"><span id="value-link">Stripe Account</span></a>
                        </li>
                        <li class="${this.isCurrentGroup(this.navBarGroup.transaction) ? 'active' : ''}">
                            <a href="${appConfig.url.transaction}" class="hyper"> <span>Transactions</span></a>
                        </li>
                    </ul>
                </div>
            </nav>
        `;

        const navBarElement = commonService.htmlToElement(navBarStr);
        this.container.appendChild(navBarElement);

        this.renderConnectToStripeButton();
    }

    async renderConnectToStripeButton() {
        const linkElement = document.getElementById(this.connectToStripeLinkId);
        if(linkElement) {
            try {
                await apiService.get(appConfig.apiUrl.checkIsConnectedBank);
                linkElement.href = appConfig.bankConnect.linkCreate;
                
                var link = document.getElementById(this.linkConnectToStripe)
                if(link !== null) {
                    document.getElementById(this.linkConnectToStripe).style.display = 'block';
                    document.getElementById(this.linkConnectToStripe).children[0].href = linkElement.href;
                }
            } catch(ex) {
                const stripeAccountLink = await apiService.get(appConfig.apiUrl.getLinkConnectBank);
                linkElement.setAttribute('target', '_blank');
                linkElement.href = stripeAccountLink;
            }
        }
    }

    /**
     * Check is current page in this group or not
     * @param {Number} groupId 
     * @returns {Boolean} checkResult
     */
    isCurrentGroup(groupId) {
        const currentUrl = window.location.href;

        switch(groupId) {
            case this.navBarGroup.route:
                if(currentUrl.indexOf(appConfig.url.home) > -1 ||
                    currentUrl.indexOf(appConfig.url.route.searchForm) > -1 ||
                    currentUrl.indexOf(appConfig.url.route.searchResult) > -1 ||
                    currentUrl.indexOf(appConfig.url.route.detail) > -1
                ) {
                    return true;
                }

                //check index page
                let domain = `${window.location.protocol}//${window.location.hostname}`;
                if(window.location.port) {
                    domain += `:${window.location.port}/`;
                } else {
                    domain += `/`;
                }

                if(currentUrl === domain) 
                    return true;

                return false;

            case this.navBarGroup.postTicket:
                if(currentUrl.indexOf(appConfig.url.postedTicket.postedTicketList) > -1 ||
                    currentUrl.indexOf(appConfig.url.postedTicket.postEditForm_2) > -1 ||
                    currentUrl.indexOf(appConfig.url.postedTicket.postEditForm) > -1
                ) {
                    return true;
                }
                return false;

            case this.navBarGroup.creditCard:
                if(currentUrl.indexOf(appConfig.url.creditCard.createCreditCard) > -1 ||
                    currentUrl.indexOf(appConfig.url.creditCard.viewListCreditCard) > -1
                ){
                    return true;
                }
                return false;

            case this.navBarGroup.connectToStripe:
                break;
                
            case this.navBarGroup.transaction:
                if(currentUrl.indexOf(appConfig.url.transaction) > -1){
                    return true;
                }
                return false;
        }

        return false;
    }
}