import AutoSuggestComponent from "../js/component/AutoSuggestComponent.js";
import apiService from './../js/service/apiService.js';
import { appConfig } from "../constant/appConfig.js";
import commonService from "../js/service/commonService.js";
import SelectMultipleComponent from "../js/component/SelectMultipleCompoment.js";

function searchRouteForm() {
    const id = {
        departureCityAutoSuggest: 'departureCityAutoSuggestContainer',
        arrivalCityAutoSuggest: 'arrivalCityAutoSuggestContainer',
        departureDate: 'departureDate',
        arrivalDate: 'arrivalDate',
        maxTickets: 'maxTicketSelect',
        btnSearch: 'btnSearch',
        vehicleSelect: 'vehicle-select',
    };

    const model = {};
    init();

    async function init() {
        //auto suggest departure city 
        new AutoSuggestComponent(id.departureCityAutoSuggest,
            function (searchValue) {
                const param = {
                    name: searchValue,
                    ignoreCityId: model.arrivalCityId === undefined ? -1 : model.arrivalCityId
                };
                return apiService.get(appConfig.apiUrl.city, param);
            },
            function (item) {
                model.departureCityId = item.id;
            },
            'City Name...',
            'form-control',
            'width-full'
        );

        //auto suggest arrival city
        new AutoSuggestComponent(id.arrivalCityAutoSuggest,
            function (searchValue) {
                const param = {
                    name: searchValue,
                    ignoreCityId: model.departureCityId === undefined ? -1 : model.departureCityId
                };
                return apiService.get(appConfig.apiUrl.city, param);
            },
            function (item) {
                model.arrivalCityId = item.id;
            },
            'City Name...',
            'form-control',
            'width-full'
        );

        $(`#${id.departureDate}`).datetimepicker({
            format: appConfig.format.date,
            minDate: new Date(),

        });

        $(`#${id.arrivalDate}`).datetimepicker({
            format: appConfig.format.date,
            minDate: new Date(),
        });

        const btnSearch = document.getElementById(id.btnSearch);
        btnSearch.addEventListener('click', function (e) {
            e.preventDefault();

            const queryString = commonService.getQueryString({
                departureCityId: model.departureCityId,
                arrivalCityId: model.arrivalCityId,
                maxTicketCombination: document.getElementById(id.maxTickets).value,
                departureDate: document.getElementById(id.departureDate).value,
                arrivalDate: document.getElementById(id.arrivalDate).value,
                page: 1,
                pageSize: 10,
            });

            window.location.href = appConfig.url.route.searchResult + '?' + queryString;
        });

        const vehicle = await getVehicle();

        new SelectMultipleComponent(vehicle, id.vehicleSelect, onVehicleSelected, 'form-control');
    }

    async function getVehicle() {
        const vehicles = await apiService.get(appConfig.apiUrl.vehicle);

        var data = vehicles.map(vehicle => {
            return {
                value: vehicle.id,
                text: vehicle.name,
                isSelected: true,
            };
        });

        return data;
    }

    function onVehicleSelected(vehicleIds) {
        console.log(vehicleIds);
    }
}

searchRouteForm();