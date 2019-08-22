import AutoSuggestComponent from "../js/component/AutoSuggestComponent.js";
import apiService from './../js/service/apiService.js';
import { appConfig } from "../constant/appConfig.js";
import commonService from "../js/service/commonService.js";
import SelectMultipleComponent from "../js/component/SelectMultipleCompoment.js";
import toastService from "../js/service/toastService.js";

function searchRouteForm() {
    const id = {
        departureCityAutoSuggest: 'departureCityAutoSuggestContainer',
        arrivalCityAutoSuggest: 'arrivalCityAutoSuggestContainer',
        departureDate: 'departureDate',
        arrivalDate: 'arrivalDate',
        maxTickets: 'maxTicketSelect',
        btnSearch: 'btnSearch',
        vehicleSelect: 'vehicle-select',
        maxWaitingHours: 'maxWaitingHourInput',
        transportation: 'transportation-select',
        ticketType: 'ticket-type-select',
        orderBy: 'orderBySelect',
    };

    const elements = {
        departureDate: document.getElementById(id.departureDate),
        arrivalDate: document.getElementById(id.arrivalDate),
        maxTickets: document.getElementById(id.maxTickets),
        btnSearch: document.getElementById(id.btnSearch),
        vehicleSelect: document.getElementById(id.vehicleSelect),
        maxWaitingHours: document.getElementById(id.maxWaitingHours),
        transportation: document.getElementById(id.transportation),
        ticketType: document.getElementById(id.ticketType),
        orderBySelect: document.getElementById(id.orderBy),
    }

    const model = {};
    const dataCloned = {};
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
            defaultDate: new Date(),
        });
        $(`#${id.departureDate}`).on("dp.change", function (e) {
            $(`#${id.arrivalDate}`).data("DateTimePicker").date(e.date);
        });

        $(`#${id.arrivalDate}`).datetimepicker({
            format: appConfig.format.date,
            minDate: new Date(),
            defaultDate: new Date(),
        });

        const btnSearch = document.getElementById(id.btnSearch);
        btnSearch.addEventListener('click', function (e) {
            e.preventDefault();

            if(!validateBeforeSearch()) {
                return;
            }

            const searchData = {
                departureCityId: model.departureCityId,
                arrivalCityId: model.arrivalCityId,
                maxTicketCombination: document.getElementById(id.maxTickets).value,
                departureDate: document.getElementById(id.departureDate).value,
                arrivalDate: document.getElementById(id.arrivalDate).value,
                maxWaitingHours: elements.maxWaitingHours.value,
                vehicleIds: model.vehicleSelectComponent.getSelected(),
                transportationIds: model.TransportationSelectComponent.getSelected(),
                ticketTypeIds: model.TicketTypeSelectComponent.getSelected(),
                orderBy: elements.orderBySelect.value,
                page: 1,
                pageSize: 10,
            };
            localStorage.setItem('SEARCH_DATA', JSON.stringify(searchData));

            window.location.href = appConfig.url.route.searchResult;
        });

        elements.maxTickets.addEventListener('change', onMaxRouteTicketsChanged);

        const vehicle = getVehicleSelectOptions();
        const transportations = getTransportationSelectOptions();
        const ticketTypes = getTicketTypeSelectOptions();

        model.vehicleSelectComponent = new SelectMultipleComponent(await vehicle, id.vehicleSelect, onVehicleSelected, 'form-control');
        model.TransportationSelectComponent = new SelectMultipleComponent(await transportations, id.transportation, onTransportationSelected, 'form-control');
        model.TicketTypeSelectComponent = new SelectMultipleComponent(await ticketTypes, id.ticketType, onTicketTypeSelected, 'form-control');
    }

    async function getVehicleSelectOptions() {
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

    async function getTransportationSelectOptions() {
        const params = {
            vehicleId: -1,
        };

        const transportations = await apiService.get(appConfig.apiUrl.transportation, params);

        var data = transportations.map(transportation => {
            return {
                value: transportation.id,
                text: transportation.name,
                isSelected: true,
                vehicleId: transportation.vehicleId,
            };
        });

        dataCloned.transportations = data;

        return data;
    }

    async function getTicketTypeSelectOptions() {
        const params = {
            vehicleId: -1,
        };
        const ticketTypes = await apiService.get(appConfig.apiUrl.ticketType, params);

        const data = ticketTypes.map(ticketType => {
            return {
                value: ticketType.id,
                text: ticketType.name,
                isSelected: true,
                vehicleId: ticketType.vehicleId,
            };
        });

        dataCloned.ticketTypes = data;

        return data;
    }

    function onVehicleSelected(vehicleIds) {
        if(dataCloned.transportations) {
            const transportations = dataCloned.transportations.filter(transportation => {
                const vehicleId = vehicleIds.find(vehicleId => vehicleId == transportation.vehicleId);
                return vehicleId !== null && vehicleId !== undefined;
            });
            model.TransportationSelectComponent.render(transportations);
        }
        
        if(dataCloned.ticketTypes) {
            const ticketTypes = dataCloned.ticketTypes.filter(ticketType => {
                const vehicleId = vehicleIds.find(vehicleId => vehicleId == ticketType.vehicleId);
                return vehicleId !== null && vehicleId !== undefined;
            });
            model.TicketTypeSelectComponent.render(ticketTypes);
        }
    }

    function onTransportationSelected(transportationIds) {
        console.log(transportationIds);
    }

    function onTicketTypeSelected(ticketTypes) {
        console.log(ticketTypes);
    }

    function onMaxRouteTicketsChanged() {
        if(elements.maxTickets.value == 1) {
            elements.maxWaitingHours.disabled = true;
        } else {
            elements.maxWaitingHours.disabled = false;
        }
    }

    function validateBeforeSearch() {
        let errorString = '';

        if(!model.departureCityId) {
            errorString = 'Please input Departure City';
        } else 
        if(!model.arrivalCityId) {
            errorString = 'Please input Arrival City';
        } else 
        if(!elements.departureDate.value) {
            errorString = 'Please input Departure Date';
        } else  
        if(!elements.arrivalDate.value) {
            errorString = 'Please input Arrival Date';
        } else 
        if(!model.vehicleSelectComponent.getSelected().length) {
            errorString = 'Please select at least one vehicle.';
        } else 
        if(!model.TransportationSelectComponent.getSelected().length) {
            errorString = 'Please select at least one Transportation.';
        } else 
        if(!model.TicketTypeSelectComponent.getSelected().length) {
            errorString = 'Please select at least one Ticket Type.';
        } else 
        if(moment(elements.departureDate.value).isAfter(moment(elements.arrivalDate.value))) {
            errorString = 'Departure Date must be before Arrival Date.';
        }

        if(errorString !== '') {
            toastService.error(errorString);
            return false;
        }
        return true;
    }
}

searchRouteForm();