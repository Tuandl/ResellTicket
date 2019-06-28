import { appConfig } from './constant/appConfig.js';
import { RouteComponent } from './js/component/RouteComponent.js';
import routeStatus from './js/enum/routeStatus.js';
import apiService from './js/service/apiService.js';
import { authenticationService } from './js/service/authenticationService.js';
import commonService from './js/service/commonService.js';
import RouteFilterStatusComponent from './js/component/routeFilterStatusComponent.js';

function indexController() {
    const id = {
        routeContainer: 'route-container',
        btnStatuses: 'btnStatuses',
        btnSearchRoute: 'btnSearchRoute',
    }

    const model = {
        page: 1,
        pageSize: 10,
        routes: [],
        searchStatus: routeStatus.New,
        routeComponents: [],
    }

    if (authenticationService.isLogedin()) {
        renderBtnStatuses();
        renderRoutes();
        
    }
    bindEvent();

    function onStatusChanged(newStatus) {
        model.searchStatus = newStatus;
        renderBtnStatuses();
        renderRoutes();
    }

    function renderBtnStatuses() {
        const container = document.getElementById(id.btnStatuses);
        commonService.removeAllChildren(container);
        const routeFilterStatusComponent = new RouteFilterStatusComponent(model.searchStatus, onStatusChanged);
        container.appendChild(routeFilterStatusComponent.render());
    }

    async function renderRoutes() {
        const params = {
            page: model.page,
            pageSize: model.pageSize,
            status: model.searchStatus,
        }

        const response = await apiService.get(appConfig.apiUrl.route + 'data-table', params);
        const containerElement = document.getElementById(id.routeContainer);
        commonService.removeAllChildren(containerElement);

        response.data.forEach(route => {
            const routeComponent = new RouteComponent(route, onRouteClicked);
            model.routeComponents.push(routeComponent);

            routeComponent.render();
            containerElement.appendChild(routeComponent.domElement);
        });
    }

    function bindEvent() {
        var btnSearchRoute = document.getElementById(id.btnSearchRoute);
        btnSearchRoute.addEventListener('click', function() {
            window.location.href = appConfig.url.route.searchForm;
        });
    }

    function onRouteClicked(route) {
        window.location.href = appConfig.url.route.detail + '?routeId=' + route.id;
    }
}

indexController();