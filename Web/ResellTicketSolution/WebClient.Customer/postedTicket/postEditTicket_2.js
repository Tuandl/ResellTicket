import { appConfig } from '../constant/appConfig.js';
import apiService from '../js/service/apiService.js';
import commonService from '../js/service/commonService.js';
import AutoSuggestComponent from "../js/component/AutoSuggestComponent.js";
import TicketStatus from '../js/enum/ticketStatus.js';
import PassengerComponent from "../js/component/PassengerComponent.js";
import { ConfirmDialogDeletePendingPostedTicket } from "./../js/component/dialogComponent/ConfirmDialogDeletePendingPostedTicket.js";
import { ConfirmDialogConfirmTicketRename } from "./../js/component/dialogComponent/ConfirmDialogConfirmTicketRename.js";
import { ConfirmDialogRefuseTicketRename } from "./../js/component/dialogComponent/ConfirmDialogRefuseTicketRename.js";
import toastService from '../js/service/toastService.js';

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
        customerDetailContainer: 'customer-detail-container',
        //confirmdialog
        dialogDeletePendingPostedTicket: 'dialog-delete-pending-posted-ticket',
        dialogConfirmTicketRename: 'dialog-confirm-ticket-rename',
        dialogRefuseTicketRename: 'dialog-refuse-ticket-rename',
        arrivalDateContainer: 'arrivalDateContainer',
    };

    const alertId = {
        transportation: 'transportation-alert',
        ticketType: 'ticketType-alert',
        departureCity: 'departureCity-alert',
        departureStation: 'departureStation-alert',
        departureDate: 'departureDate-alert',
        arrivalCity: 'arrivalCity-alert',
        arrivalStation: 'arrivalStation-alert',
        arrivalDate: 'arrivalDate-alert',
        ticketCode: 'ticketCode-alert',
        passsengerName: 'passName-alert',
        emailBooking: 'email-alert',
        sellingPrice: 'price-alert'
    }

    const elements = {
        dialogDeletePendingPostedTicket: document.getElementById(id.dialogDeletePendingPostedTicket),
        dialogConfirmTicketRename: document.getElementById(id.dialogConfirmTicketRename),
        dialogRefuseTicketRename: document.getElementById(id.dialogRefuseTicketRename)
    }

    const modelConfirmDialog = {
        dialogDeletePendingPostedTicketBox: [],
        dialogConfirmTicketRenameBox: [],
        dialogRefuseTicketRenameBox: []
    }

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
        initArrivalDateTimePicker();
        initTicketCodeInputField();
        initPassengerNameInputField();
        initEmailBookingInputField();
        initSellingPriceInputField();
        initConfirmDialog();
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
            if (data.status === TicketStatus.Invalid) {
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
            document.getElementById(id.arrivalDate).style.border = invalidBorderStyle;
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

    function createBtnDelete(btnValue, event) {
        var divBtn = document.getElementById('btnEvent');
        var btn = document.createElement('INPUT');
        btn.setAttribute('type', 'button');
        btn.setAttribute('value', btnValue);
        btn.setAttribute('class', 'btn-delete-now');
        btn.addEventListener('click', event);
        divBtn.appendChild(btn);
    }

    function createBtnConfirm(btnValue, event) {
        var divBtn = document.getElementById('btnEvent');
        var btn = document.createElement('INPUT');
        btn.setAttribute('type', 'button');
        btn.setAttribute('value', btnValue);
        btn.setAttribute('class', 'btn-confirm-now');
        btn.addEventListener('click', event);
        divBtn.appendChild(btn);
    }

    function createBtnView(btnValue, event) {
        var divBtn = document.getElementById('btnEvent');
        var btn = document.createElement('INPUT');
        btn.setAttribute('type', 'button');
        btn.setAttribute('value', btnValue);
        btn.setAttribute('class', 'btn-view-now');
        btn.setAttribute('onclick', event);
        divBtn.appendChild(btn);
    }

    function initConfirmDialog() {
        commonService.removeAllChildren(elements.dialogDeletePendingPostedTicket);
        commonService.removeAllChildren(elements.dialogConfirmTicketRename);
        commonService.removeAllChildren(elements.dialogRefuseTicketRename);
        //
        const confirmDialogDeletePendingPostedTicket = new
            ConfirmDialogDeletePendingPostedTicket("Delete Ticket", "Do you want to delete this ticket ?",
                "Delete", showConfirmDialogDeletePendingPostedTicket, deleteTicket);
        modelConfirmDialog.dialogDeletePendingPostedTicketBox.push(confirmDialogDeletePendingPostedTicket);
        confirmDialogDeletePendingPostedTicket.render();
        elements.dialogDeletePendingPostedTicket.appendChild(confirmDialogDeletePendingPostedTicket.domElement);
        //
        const confirmDialogConfirmTicketRename = new
            ConfirmDialogConfirmTicketRename("Confirm Rename Ticket", "Do you want to confirm this ticket renamed ?",
                "Confirm", showConfirmDialogConfirmTicketRename, confirmTicketRename);
        modelConfirmDialog.dialogConfirmTicketRenameBox.push(confirmDialogConfirmTicketRename);
        confirmDialogConfirmTicketRename.render();
        elements.dialogConfirmTicketRename.appendChild(confirmDialogConfirmTicketRename.domElement);
        //
        const confirmDialogRefuseTicketRename = new
            ConfirmDialogRefuseTicketRename("Refuse Ticket Rename", "Do you want to refuse to rename this ticket ?",
                "Refuse", showConfirmDialogRefuseTicketRename, refuseTicketRename);
        modelConfirmDialog.dialogRefuseTicketRenameBox.push(confirmDialogRefuseTicketRename);
        confirmDialogRefuseTicketRename.render();
        elements.dialogRefuseTicketRename.appendChild(confirmDialogRefuseTicketRename.domElement);
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
                    createBtnDelete('DELETE', () => showConfirmDialogDeletePendingPostedTicket())
                    break
                case TicketStatus.Valid:
                    document.getElementById('title').innerHTML = 'TICKET DETAIL';
                    createBtnDelete('DELETE', () => showConfirmDialogDeletePendingPostedTicket())
                    break
                case TicketStatus.Invalid:
                    document.getElementById('title').innerHTML = 'TICKET DETAIL';
                    createBtnDelete('DELETE', () => showConfirmDialogDeletePendingPostedTicket())
                    break
                case TicketStatus.Bought:
                    document.getElementById('title').innerHTML = 'CONFIRM TICKET RENAMING'
                    createBtn('BUYER INFO', () => viewPassengerInfo());
                    createBtnConfirm('CONFIRM', () => showConfirmDialogConfirmTicketRename());
                    createBtnDelete('REFUSE', () => showConfirmDialogRefuseTicketRename());
                    break;
                case TicketStatus.Completed:
                    document.getElementById('title').innerHTML = 'TICKET DETAIL'
                    createBtnDelete('DELETE', () => showConfirmDialogDeletePendingPostedTicket())
                    break;
                case TicketStatus.RenamedFail:
                    document.getElementById('title').innerHTML = 'TICKET DETAIL'
                    createBtnDelete('DELETE', () => showConfirmDialogDeletePendingPostedTicket())
                    break
            }
        }
    }

    ////pending + valid + Invalid
    function showConfirmDialogDeletePendingPostedTicket() {
        $('#delete-pending-posted-ticket').modal();
    }
    // ////valid
    // function showConfirmDialogDeleteValidPostedTicket() {
    //     $('#delete-valid-posted-ticket').modal();
    // }
    // ////Invalid
    // function showConfirmDialogDeleteInvalidPostedTicket() {
    //     $('#delete-invalid-posted-ticket').modal();
    // }
    ////Bought
    //confirm
    function showConfirmDialogConfirmTicketRename() {
        $('#confirm-ticket-rename').modal();
    }
    //refuse
    function showConfirmDialogRefuseTicketRename() {
        $('#refuse-ticket-rename').modal();
    }

    async function postTicket() {
        if (model.transportationId !== undefined && model.ticketTypeId !== undefined && model.departureStationId !== undefined && model.arrivalStationId !== undefined
            && model.departureDateTime !== undefined && model.arrivalDateTime != undefined && model.ticketCode !== undefined && model.passengerName != undefined
            && model.emailBooking !== undefined && model.sellingPrice !== undefined) {
            const res = await apiService.post(appConfig.apiUrl.ticket, model);
            if (res.status === 200) {
                window.location.href = "postedTicket.html";
            }
        } else {
            document.getElementById(alertId.transportation).style.display = model.transportationId == undefined ? 'inline' : 'none'
            document.getElementById(alertId.ticketType).style.display = model.ticketTypeId == undefined ? 'inline' : 'none'
            document.getElementById(alertId.departureCity).style.display = model.departureCityId == undefined ? 'inline' : 'none'
            document.getElementById(alertId.departureStation).style.display = model.departureStationId == undefined ? 'inline' : 'none'
            document.getElementById(alertId.departureDate).style.display = model.departureDateTime == undefined ? 'inline' : 'none'
            document.getElementById(alertId.arrivalCity).style.display = model.arrivalCityId == undefined ? 'inline' : 'none'
            document.getElementById(alertId.arrivalStation).style.display = model.arrivalStationId == undefined ? 'inline' : 'none'
            document.getElementById(alertId.arrivalDate).style.display = model.arrivalDateTime == undefined ? 'inline' : 'none'
            document.getElementById(alertId.ticketCode).style.display = model.ticketCode == undefined ? 'inline' : 'none'
            document.getElementById(alertId.passsengerName).style.display = model.passengerName == undefined ? 'inline' : 'none'
            document.getElementById(alertId.emailBooking).style.display = model.emailBooking == undefined ? 'inline' : 'none'
            document.getElementById(alertId.sellingPrice).style.display = model.sellingPrice == undefined ? 'inline' : 'none'
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

    // async function viewPassengerInfo() {
    //     const res = await apiService.get(appConfig.apiUrl.ticketViewPassengerInfo, { ticketId });
    //     if (res.status === 200) {
    //         window.location.href = "postedTicket.html";
    //     }
    // }

    function viewPassengerInfo() {
        renderCustomerDetail(ticketId);
    }

    async function renderCustomerDetail(ticketId) {
        var customerDetailContainer = document.getElementById(id.customerDetailContainer);
        commonService.removeAllChildren(customerDetailContainer);
        const passengerComponent = new PassengerComponent(ticketId);
        await passengerComponent.passengerDetail();
        customerDetailContainer.appendChild(passengerComponent.render());
        await passengerComponent.disabledField();
        // passengerComponent.passengerDetail();
        $(`#${'customer-detail-modal'}`).modal();
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
            var arrivalDateContainer = document.getElementById(id.arrivalDateContainer)
            arrivalDateContainer.removeChild(document.getElementById(id.arrivalDate));
            var newArrivalDate = commonService.htmlToElement('<input type="text" placeholder="Arrival Date" id="arrivalDate" class="form-control" disabled>')
            arrivalDateContainer.appendChild(newArrivalDate)
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
        var minArrivalDate = moment(model.departureDateTime).subtract(1, 'days')._d;
        //console.log(moment(temp).format('YYYY-MM-DD'));
        document.getElementById(id.arrivalDate).disabled = false;
        $(`#${id.arrivalDate}`).datetimepicker({
            format: appConfig.format.datetime,
            minDate: new Date(moment(minArrivalDate).format('YYYY-MM-DD')),
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