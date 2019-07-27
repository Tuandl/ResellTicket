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
        showEmptyList: 'show-empty-list'
    }
    const routesContainer = document.getElementById(id.routesContainer);
    const routeDetailContainer = document.getElementById(id.routeDetailContainer);

    const params = JSON.parse(localStorage.getItem('SEARCH_DATA'));
    params.departureDate = moment(params.departureDate).format(appConfig.format.datetimeISO);
    params.arrivalDate = moment(params.arrivalDate).format(appConfig.format.datetimeISO);

    const model = {
        isLoadingMore: false,
        isLoadAll: false,
        routes: [],
    };
    init();
    
    async function init() {
        model.isLoadingMore = true;
        const routeSearchResults = await apiService.post(appConfig.apiUrl.route + 'search', params);
        const data = await routeSearchResults.json();
        mapRoute(data);
        renderRoutes();
        model.isLoadingMore = false;

        $(window).scroll(async function() {
            if($(window).scrollTop() + $(window).height() >= ($(document).height() - $('.footer').height())) {
                if(!model.isLoadAll && !model.isLoadingMore) {
                    model.isLoadingMore = true;
                    params.page++;

                    const response = await apiService.post(appConfig.apiUrl.route + 'search', params);
                    const data = await response.json();
                    mapRoute(data);
                    renderRoutes(false);

                    if(data.length < params.pageSize) {
                        model.isLoadAll = true;
                    }
                    model.isLoadingMore = false;
                } 
            }
        });  
    }

    function mapRoute(routes) {
        var newRoutes = routes.map(route => {
            const firstTicket = route.routeTickets[0];
            const lastTicket = route.routeTickets[route.routeTickets.length - 1];
            let expiredDate = route.routeTickets.reduce((preValue, currentValue) => {
                if(preValue.isAfter(moment(currentValue.expiredDate))) {
                    return moment(currentValue.expiredDate);
                }
                return preValue;
            }, moment('2099-01-01'));

            return {
                id: route.id || commonService.generateRandomId(),
                code: route.code || '',
                rawData: route,
                totalAmount: route.totalAmount,
                status: routeStatus.New,
                departureCityName: firstTicket.departureCityName,
                arrivalCityName: lastTicket.arrivalCityName,
                ticketQuantity: route.routeTickets.length,
                departureDate: firstTicket.departureDateTime,
                arrivalDate: lastTicket.arrivalDateTime,
                saved: route.saved || false,
                routeTickets: route.routeTickets,
                expiredDate: expiredDate,
            }
        });

        model.routes = [...model.routes, ...newRoutes];

        if(model.routes === null || model.routes === undefined || model.routes.length === 0) {
            document.getElementById(id.showEmptyList).style.display = 'block';
        } else {
            document.getElementById(id.showEmptyList).style.display = 'none';
        }
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