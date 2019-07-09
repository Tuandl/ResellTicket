import { appConfig } from '../constant/appConfig.js';
import apiService from '../js/service/apiService.js';
import commonService from '../js/service/commonService.js';
import AutoSuggestComponent from "../js/component/AutoSuggestComponent.js";
import TicketStatus from '../js/enum/ticketStatus.js';

function postEditTicketController() {

    const id = {
        vehicle: 'select-vehicle',
        transportation: 'transportation',
        ticketType: 'ticketType',
        departureCity: 'departureCity',
        departureStation: 'departureStation',
        departureDate: 'departureDate',
        arrivalCity: 'arrivalCity',
        arrivalStation: 'arrivalStation',
        arrivalDate: 'arrivalDate',
        ticketCode: 'ticketCode',
        passengerName: 'passengerName',
        emailBooking: 'emailBooking',
        sellingPrice: 'sellingPrice',
        btnEvent: 'btnEvent',
    };

    var model = {};
    const ticketId = window.location.search.substr(10);
    init();
    getTicketDetail();


    function init() {
        getVehicle();
        initTransportationAutoSuggest();
        initTicketTypeAutoSuggest();
        initDepartureCityAutoSuggest();
        initDepartureStationAutoSuggest();
        initDepartureDateTimePicker();
        initArrivalCityAutoSuggest();
        initArrivalStationAutoSuggest();
        ///initArrivalDateTimePicker();
        initTicketCodeInputField();
        initPassengerNameInputField();
        initEmailBookingInputField();
        initSellingPriceInputField();
    }
    

    async function getTicketDetail() {
        if (ticketId !== '') {
            const data = await apiService.get(appConfig.apiUrl.ticketDetail, { ticketId });
            model = data;
            model.departureDateTime = moment(data.departureDateTime).format(appConfig.format.datetimeISO);
            model.arrivalDateTime = moment(data.arrivalDateTime).format(appConfig.format.datetimeISO);

            document.getElementById(id.vehicle).value = data.vehicleId;
            document.getElementById(id.transportation).children[0].children[0].value = data.transportationName;
            document.getElementById(id.ticketType).children[0].children[0].value = data.ticketTypeName;
            document.getElementById(id.departureCity).children[0].children[0].value = data.departureCityName;
            document.getElementById(id.departureStation).children[0].children[0].value = data.departureStationName;
            document.getElementById(id.departureDate).value = moment(data.departureDateTime).format(appConfig.format.datetime);
            document.getElementById(id.arrivalCity).children[0].children[0].value = data.arrivalCityName;
            document.getElementById(id.arrivalStation).children[0].children[0].value = data.arrivalStationName;
            document.getElementById(id.arrivalDate).value = moment(data.arrivalDateTime).format(appConfig.format.datetime);
            document.getElementById(id.ticketCode).value = data.ticketCode;
            document.getElementById(id.sellingPrice).value = numeral(data.sellingPrice).format('$0,0.00');
            document.getElementById(id.passengerName).value = data.passengerName;
            document.getElementById(id.emailBooking).value = data.emailBooking;

            if (data.status !== TicketStatus.Pending) {
                document.getElementById(id.vehicle).setAttribute('disabled', '')
                var inputTags = document.getElementsByTagName('input');
                for (var i = 0; i < inputTags.length; i++) {
                    inputTags[i].setAttribute('readonly', '');
                }
            }
            if(data.status === TicketStatus.Invalid) {
                displayInvalidField(data)
            }
        }
        initBtnEvent();
    }

    function displayInvalidField(data) {
        var invalidBorderStyle = '1px solid red';
        if (!data.isVehicleValid) {
            document.getElementById(id.vehicle).style.border = invalidBorderStyle;
        }
        if (!data.isTransportationValid) {
            document.getElementById(id.transportation).children[0].children[0].style.border = invalidBorderStyle;
        }
        if (!data.isTicketTypeValid) {
            document.getElementById(id.ticketType).children[0].children[0].style.border = invalidBorderStyle;
        }
        if (!data.isDepartureValid) {
            document.getElementById(id.departureCity).children[0].children[0].style.border = invalidBorderStyle;
            document.getElementById(id.departureStation).children[0].children[0].style.border = invalidBorderStyle;
            document.getElementById(id.departureDate).style.border = invalidBorderStyle;
        }
        if (!data.isArrivalValid) {
            document.getElementById(id.arrivalCity).children[0].children[0].style.border = invalidBorderStyle;
            document.getElementById(id.arrivalStation).children[0].children[0].style.border = invalidBorderStyle;
            document.getElementById(id.arrivalDate).border = invalidBorderStyle;
        }
        if (!data.isTicketCodeValid) {
            document.getElementById(id.ticketCode).style.border = invalidBorderStyle;
        }
        if (!data.isEmailBookingValid) {
            document.getElementById(id.emailBooking).style.border = invalidBorderStyle;
        }
        if (!data.isPassengerNameValid) {
            document.getElementById(id.passengerName).style.border = invalidBorderStyle;
        }
    }

    function createBtn(btnValue, event) {
        var divBtn = document.getElementById('btnEvent');
        var btn = document.createElement('INPUT');
        btn.setAttribute('type', 'button');
        btn.setAttribute('value', btnValue);
        btn.setAttribute('class', 'btn-post-now');
        btn.addEventListener('click', event);
        divBtn.appendChild(btn);
    }

    function initBtnEvent() {
        if (ticketId === '') {
            document.getElementById('title').innerHTML = 'POST TICKET'
            createBtn('POST NOW', () => postTicket())
        } else {
            switch (model.status) {
                case TicketStatus.Pending:
                    document.getElementById('title').innerHTML = 'EDIT TICKET'
                    createBtn('SAVE', () => editTicket())
                    createBtn('DELETE', () => deleteTicket())
                    break
                case TicketStatus.Valid:
                    createBtn('DELETE', () => deleteTicket())
                    break
                case TicketStatus.Invalid:
                    createBtn('DELETE', () => deleteTicket())
                    break
                case TicketStatus.Bought:
                    document.getElementById('title').innerHTML = 'CONFIRM TIKCET RENAMING'
                    createBtn('CONFIRM', () => confirmTicketRename());
                    createBtn('REFUSE', () => refuseTicketRename());
            }
        }
    }

    async function postTicket() {
        const res = await apiService.post(appConfig.apiUrl.ticket, model);
        if (res.status === 200) {
            window.location.href = "postedTicket.html";
        }
    }

    async function editTicket() {
        const res = await apiService.put(appConfig.apiUrl.ticket, model);
        if (res.status === 200) {
            window.location.href = "postedTicket.html";
        }
    }

    async function confirmTicketRename() {
        const res = await apiService.putParams(appConfig.apiUrl.ticketConfirmRenamed, { id: ticketId });
        if (res.status === 200) {
            window.location.href = "postedTicket.html";
        }
    }

    async function refuseTicketRename() {
        const res = await apiService.putParams(appConfig.apiUrl.ticketRefuseRenamed, { id: ticketId });
        if (res.status === 200) {
            window.location.href = "postedTicket.html";
        }
    }

    async function deleteTicket() {
        const res = await apiService.delete(appConfig.apiUrl.ticket, { ticketId });
        if (res.status === 200) {
            window.location.href = "postedTicket.html";
        }
    }

    async function getVehicle() {
        const selectVehicle = document.getElementById('select-vehicle')
        const data = await apiService.get(appConfig.apiUrl.vehicle);
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var option = document.createElement('OPTION');
                option.setAttribute('value', data[i].id);
                option.innerHTML = data[i].name;
                selectVehicle.appendChild(option);
            }
        }
    }

    function initTransportationAutoSuggest() {
        new AutoSuggestComponent(id.transportation,
            function (searchValue) {
                const params = {
                    vehicleId: document.getElementById(id.vehicle).value,
                    transportationName: searchValue,
                };
                return apiService.get(appConfig.apiUrl.transportation, params);
            },
            function (item) {
                model.transportationId = item.id;
            },
            'Transportation...',
            'form-control',
            'width-full'
        );
    }

    function initTicketTypeAutoSuggest() {
        new AutoSuggestComponent(id.ticketType,
            function (searchValue) {
                const params = {
                    vehicleId: document.getElementById(id.vehicle).value,
                    ticketTypeName: searchValue,
                };
                return apiService.get(appConfig.apiUrl.ticketType, params);
            },
            function (item) {
                model.ticketTypeId = item.id;
            },
            'Ticket Type...',
            'form-control',
            'width-full'
        );
    }

    function initDepartureCityAutoSuggest() {
        new AutoSuggestComponent(id.departureCity,
            function (searchValue) {
                const params = {
                    name: searchValue,
                    ignoreCityId: model.arrivalCityId === undefined ? -1 : model.arrivalCityId
                };
                return apiService.get(appConfig.apiUrl.city, params);
            },
            function (item) {
                if (model.departureCityId !== item.id) {
                    model.departureStationId = undefined;
                    document.getElementById(id.departureStation).children[0].children[0].value = ''
                }
                model.departureCityId = item.id;
            },
            'Departure City...',
            'form-control',
            'width-full'
        );
    }

    function initDepartureStationAutoSuggest() {
        new AutoSuggestComponent(id.departureStation,
            function (searchValue) {
                const params = {
                    cityId: model.departureCityId === undefined ? -1 : model.departureCityId,
                    name: searchValue,
                    ignoreStationId: model.arrivalStationId === undefined ? -1 : model.arrivalStationId
                };
                return apiService.get(appConfig.apiUrl.station, params);
            },
            function (item) {
                model.departureStationId = item.id;
                model.departureCityId = item.cityId;
                document.getElementById(id.departureCity).children[0].children[0].value = item.cityName
            },
            'Departure Station...',
            'form-control',
            'width-full'
        );
    }

    function initDepartureDateTimePicker() {
        $(`#${id.departureDate}`).datetimepicker({
            format: appConfig.format.datetime,
            minDate: new Date()
        });
        document.getElementById(id.departureDate).addEventListener('blur', function (e) {
            model.departureDateTime = moment(this.value).format(appConfig.format.datetimeISO)
            initArrivalDateTimePicker();
        })
    }

    function initArrivalCityAutoSuggest() {
        new AutoSuggestComponent(id.arrivalCity,
            function (searchValue) {
                const params = {
                    name: searchValue,
                    ignoreCityId: model.departureCityId === undefined ? -1 : model.departureCityId
                };
                return apiService.get(appConfig.apiUrl.city, params);
            },
            function (item) {
                if (model.arrivalCityId !== item.id) {
                    model.arrivalStationId = undefined;
                    document.getElementById(id.arrivalStation).children[0].children[0].value = ''
                }
                model.arrivalCityId = item.id;
            },
            'Arrival City...',
            'form-control',
            'width-full'
        );
    }

    function initArrivalStationAutoSuggest() {
        new AutoSuggestComponent(id.arrivalStation,
            function (searchValue) {
                const params = {
                    cityId: model.arrivalCityId === undefined ? -1 : model.arrivalCityId,
                    name: searchValue,
                    ignoreStationId: model.departureStationId === undefined ? -1 : model.departureStationId
                };
                return apiService.get(appConfig.apiUrl.station, params);
            },
            function (item) {
                model.arrivalStationId = item.id;
                model.arrivalCityId = item.cityId;
                document.getElementById(id.arrivalCity).children[0].children[0].value = item.cityName
            },
            'Arrival Station...',
            'form-control',
            'width-full'
        );
    }

    function initArrivalDateTimePicker() {
        document.getElementById(id.arrivalDate).disabled = false;
        $(`#${id.arrivalDate}`).datetimepicker({
            format: appConfig.format.datetime,
            minDate: new Date(moment(model.departureDateTime).format('YYYY-MM-DD'))
        });
        document.getElementById(id.arrivalDate).addEventListener('blur', function (e) {
            model.arrivalDateTime = moment(this.value).format(appConfig.format.datetimeISO)
        })
    }

    function initTicketCodeInputField() {
        document.getElementById(id.ticketCode).addEventListener('input', function (e) {
            model.ticketCode = this.value
        })
    }

    function initPassengerNameInputField() {
        document.getElementById(id.passengerName).addEventListener('input', function (e) {
            model.passengerName = this.value
        })
    }

    function initEmailBookingInputField() {
        document.getElementById(id.emailBooking).addEventListener('input', function (e) {
            model.emailBooking = this.value
        })
    }

    function initSellingPriceInputField() {
        document.getElementById(id.sellingPrice).addEventListener('keyup', function (e) {
            formatCurrency(this)
        })
        document.getElementById(id.sellingPrice).addEventListener('blur', function (e) {
            formatCurrency(this, 'blur')
        })
    }

    /* start format currency */
    function formatNumber(n) {
        // format number 1000000 to 1,234,567
        return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    function formatCurrency(input, blur) {
        // appends $ to value, validates decimal side
        // get input value
        var input_val = input.value;
        // don't validate empty input
        if (input_val === "") { return; }
        // check for decimal
        if (input_val.indexOf(".") >= 0) {
            // get position of first decimal
            // this prevents multiple decimals from
            // being entered
            var decimal_pos = input_val.indexOf(".");
            // split number by decimal point
            var left_side = input_val.substring(0, decimal_pos);
            var right_side = input_val.substring(decimal_pos);
            // add commas to left side of number
            left_side = formatNumber(left_side);
            // validate right side
            right_side = formatNumber(right_side);
            // On blur make sure 2 numbers after decimal
            if (blur === "blur") {
                right_side += "00";
            }
            // Limit decimal to only 2 digits
            right_side = right_side.substring(0, 2);
            // join number by .
            input_val = "$" + left_side + "." + right_side;
        } else {
            // no decimal entered
            // add commas to number
            // remove all non-digits
            input_val = formatNumber(input_val);
            input_val = "$" + input_val;
            // final formatting
            if (blur === "blur") {
                input_val += ".00";
            }
        }
        // send updated string to input
        input.value = input_val;
        model.sellingPrice = input_val.replace(/,/g, '').replace('$', '');
    }
    /* end format currency */
}

postEditTicketController()