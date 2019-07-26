import commonService from "../js/service/commonService.js";
import { appConfig } from "../constant/appConfig.js";
import apiService from "../js/service/apiService.js";
import routeStatus from '../js/enum/routeStatus.js';
import { RouteComponent } from "../js/component/RouteComponent.js";
import toastService from "../js/service/toastService.js";
import TicketComponent from "../js/component/TicketComponent.js";

function searchResult() {

    const id = {
        routesContainer: 'route-container',
        routeDetailContainer: 'route-detail-container',
        routeDetailModal: 'route-detail-modal',
    }
    const routesContainer = document.getElementById(id.routesContainer);
    const routeDetailContainer = document.getElementById(id.routeDetailContainer);

    const params = {
        departureCityId: commonService.getQueryParam('departureCityId'),
        arrivalCityId: commonService.getQueryParam('arrivalCityId'),
        maxTicketCombination: commonService.getQueryParam('maxTicketCombination'),
        departureDate: moment(commonService.getQueryParam('departureDate')).format(appConfig.format.datetimeISO),
        arrivalDate: moment(commonService.getQueryParam('arrivalDate')).format(appConfig.format.datetimeISO),
        page: 1,
        pageSize: 10,
    };

    const model = {
        isLoadingMore: false,
        isLoadAll: false,
        routes: [],
    };
    init();
    
    async function init() {
        model.isLoadingMore = true;
        const routeSearchResults = await apiService.get(appConfig.apiUrl.route + 'search', params);
        mapRoute(routeSearchResults);
        renderRoutes();
        model.isLoadingMore = false;

        $(window).scroll(async function() {
            if($(window).scrollTop() + $(window).height() >= ($(document).height() - $('.footer').height())) {
                if(!model.isLoadAll && !model.isLoadingMore) {
                    model.isLoadingMore = true;
                    params.page++;

                    const response = await apiService.get(appConfig.apiUrl.route + 'search', params);
                    mapRoute(response);
                    renderRoutes(false);

                    if(response.length < params.pageSize) {
                        model.isLoadAll = true;
                    }
                    model.isLoadingMore = false;
                } 
            }
        });  
    }

    function mapRoute(routes) {
        var newRoutes = routes.map(route => {
            return {
                id: route.id || commonService.generateRandomId(),
                code: route.code || '',
                rawData: route,
                totalAmount: route.totalAmount,
                status: routeStatus.New,
                departureCityName: route.routeTickets[0].departureCityName,
                arrivalCityName: route.routeTickets[route.routeTickets.length - 1].arrivalCityName,
                ticketQuantity: route.routeTickets.length,
                departureDate: route.routeTickets[0].departureDateTime,
                arrivalDate: route.routeTickets[0].arrivalDateTime,
                saved: route.saved || false,
                routeTickets: route.routeTickets,
            }
        });

        model.routes = [...model.routes, ...newRoutes];
    }

    function renderRoutes(doNotDeleteChildren) {
        if(!doNotDeleteChildren) {
            commonService.removeAllChildren(routesContainer);
        }

        model.routes.forEach(route => {
            const routeComponent = new RouteComponent(route);

            routeComponent.render();
            const routeElement = routeComponent.domElement;
            routesContainer.appendChild(routeElement);

            routeComponent.domElement.addEventListener('click', function(e) {
                onRouteClicked(this.id);
            });
        })
    }

    async function onRouteClicked(routeId) {
        var route = model.routes.find(route => route.id == routeId);
        if(route.saved) {
            renderRouteDetail(route);

        } else {
            const routeId = await saveRoute(route);
            window.location.href = `${appConfig.url.route.detail}?routeId=${routeId}`;
            // newRoute.saved = true;
            // const routes = model.routes.map(route => {
            //     return route.id == routeId ? newRoute : route;
            // });
            // mapRoute(routes);
            // // renderRoutes();
            // route = model.routes.find(route => route.id == newRoute.id);
            // renderRouteDetail(route);
        }
    }

    async function saveRoute(route) {
        const response = await apiService.post(appConfig.apiUrl.route, route.rawData);
        const routeId = await response.json();
        // const newRoute = await apiService.get(appConfig.apiUrl.route + routeId);
        // toastService.success('Saved');
        return routeId;
    }

    function renderRouteDetail(route) {
        commonService.removeAllChildren(routeDetailContainer);
        const tickets = route.rawData.routeTickets;

        tickets.forEach(ticket => {
            const ticketComponent = new TicketComponent(ticket);
            routeDetailContainer.appendChild(ticketComponent.render());
        })
        $(`#${id.routeDetailModal}`).modal();
    }
}

searchResult();