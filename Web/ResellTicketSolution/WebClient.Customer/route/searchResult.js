import commonService from "../js/service/commonService.js";
import { appConfig } from "../constant/appConfig.js";
import apiService from "../js/service/apiService.js";
import routeStatus from '../js/enum/routeStatus.js';
import { RouteComponent } from "../js/component/RouteComponent.js";

function searchResult() {

    const id = {
        routesContainer: 'route-container',
    }
    const routesContainer = document.getElementById(id.routesContainer);

    const params = {
        departureCityId: commonService.getQueryParam('departureCityId'),
        arrivalCityId: commonService.getQueryParam('arrivalCityId'),
        maxTicketCombination: commonService.getQueryParam('maxTicketCombination'),
        departureDate: moment(commonService.getQueryParam('departureDate')).format(appConfig.format.datetimeISO),
        page: commonService.getQueryParam('page'),
        pageSize: commonService.getQueryParam('pageSize'),
    };

    const model = {};
    init();
    
    async function init() {
        const routeSearchResults = await apiService.get(appConfig.apiUrl.route + 'search', params);

        // if(routeSearchResults.length > 0) {
        //     const route = routeSearchResults[0];
        //     model.departureCityName = route.departureCityName;
        //     model.arrivalCityName = route.arrivalCityName;
        // }

        model.routes = routeSearchResults.map(route => {
            return {
                rawData: route,
                totalAmount: route.totalAmount,
                status: routeStatus.New,
                departureCityName: route.routeTickets[0].departureCityName,
                arrivalCityName: route.routeTickets[route.routeTickets.length - 1].arrivalCityName,
                ticketQuantity: route.routeTickets.length,
                departureDate: route.routeTickets[0].departureDateTime,
                arrivalDate: route.routeTickets[0].arrivalDateTime,
            }
        });

        renderRoutes();
    }

    function renderRoutes() {
        commonService.removeAllChildren(routesContainer);

        model.routes.forEach(route => {
            const routeComponent = new RouteComponent(route);

            routeComponent.render();
            routesContainer.appendChild(routeComponent.domElement);
        })
    }
}

searchResult();