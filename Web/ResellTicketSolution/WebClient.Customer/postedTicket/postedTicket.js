

function getPostedTicket() {
    ReactDOM.render(
        React.createElement(TicketList),
        document.getElementById('myTickets')
    );

}
class TicketList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tickets: [],
        }
    }

    componentDidMount() {
        this.getPostedTicket();
    }

    async getPostedTicket() {
        const res = await Get('api/ticket?customerId=' + 1 + '&page=' + 1);
        if (res.status === 200) {
            var data = await res.json();
            this.setState({
                tickets: data
            }, () => {
                var tickets = document.getElementsByClassName('route');
                for (var i = 0; i < tickets.length; i++) {
                    var ticketId = tickets[i].childNodes[0].value;
                    tickets[i].addEventListener('click', function (ticketCopy) {
                        return function () {
                            window.location.href = 'postEditTicket.html?ticketId=' + ticketCopy;
                        }
                    }(ticketId))
                }
            })
        }
    }

    render() {
        var { tickets } = this.state
        return (
            tickets.map((item, index) => {
                //console.log(item.Id)
                var labelStatus = item.status === 1 ? 'label label-warning' : item.status === 3 ? 'label label-danger' : 'label label-success'
                return (
                    <div className="row" key={index} style={{ marginBottom: 50 }}>
                        <h3 style={{ color: '#fab005' }}>
                            <span>{item.departureCityName}  </span>
                            <i className="fa fa-long-arrow-right"></i>
                            <span>  {item.arrivalCityName}</span>
                        </h3>

                        <div className="col-md-12 route">
                            <input type="hidden" value={item.id} />
                            <div className="routeHeader">
                                <div className="col-md-2">
                                    <h4><b>Ticket</b></h4>
                                </div>
                                <div className="col-md-2">
                                    <h4><b>Departure</b></h4>
                                </div>
                                <div className="col-md-2">
                                    <h4><b>Arrival</b></h4>
                                </div>
                                <div className="col-md-2">
                                    <h4><b>Vehicle</b></h4>
                                </div>
                                <div className="col-md-2">
                                    <h4><b>Status</b></h4>
                                </div>
                                <div className="col-md-2">
                                    <h4><b>Price</b></h4>
                                </div>
                            </div>
                            <div className="routeBody" style={{ color: '#b8891d' }}>
                                <div className="col-md-2"><span><b>{item.ticketCode}</b></span></div>
                                <div className="col-md-2">
                                    <span>{moment(item.departureDateTime).format('MMM DD YYYY HH:mm')}</span>
                                </div>
                                <div className="col-md-2">
                                    <span>{moment(item.arrivalDateTime).format('MMM DD YYYY HH:mm')}</span>
                                </div>
                                <div className="col-md-2"><span>{item.vehicle}</span></div>
                                <div className="col-md-2"><span className={labelStatus}>{convertStatusForSeller(item.status)}</span></div>

                                <div className="col-md-2">
                                    <h3>{numeral(item.sellingPrice).format('$0,0.00')}</h3>
                                </div>
                            </div>
                            <div className="routeFooter">
                                <span style={{ color: 'red' }}>Expired Date: June/16/2019 22:00</span>
                            </div>
                        </div>
                    </div>
                )
            })
        )
    }
}

//post, edit Ticket
var ticketId = window.location.search.substr(10);
var ticketInfo = {
    ticketCode: '',
    vehicleId: -1,
    transportationId: -1,
    ticketTypeId: -1,
    departureCityId: -1,
    departureStationId: -1,
    arrivalCityId: -1,
    arrivalStationId: -1,
    departureDateTime: '',
    arrivalDateTime: '',
    sellingPrice: ''
}

async function getTicketDetail() {
    var divBtn = document.getElementById('btnPostEditDelete');
    if (ticketId === '') {
        var btnPost = document.createElement('INPUT');
        btnPost.setAttribute('type', 'button');
        btnPost.setAttribute('value', 'POST NOW');
        btnPost.setAttribute('class', 'btn-post-now');
        btnPost.setAttribute('onclick', 'postTicket()');
        divBtn.appendChild(btnPost);
        return;
    }
    const res = await Get('api/ticket/detail?ticketId=' + ticketId);
    if (res.status === 200) {
        const data = await res.json();
        console.log(data)
        document.getElementById('select-vehicle').value = data.vehicleId;
        document.getElementById('transportation').value = data.transportationName;
        document.getElementById('ticketType').value = data.ticketTypeName;
        document.getElementById('departureCity').value = data.departureCityName;
        document.getElementById('departureStation').value = data.departureStationName;
        document.getElementById('departureDate').value = moment(data.departureDateTime).format('MMM DD YYYY HH:mm');
        document.getElementById('arrivalCity').value = data.arrivalCityName;
        document.getElementById('arrivalStation').value = data.arrivalStationName;
        document.getElementById('arrivalDate').value = moment(data.arrivalDateTime).format('MMM DD YYYY HH:mm');
        document.getElementById('ticketCode').value = data.ticketCode;
        document.getElementById('sellingPrice').value = numeral(data.sellingPrice).format('$0,0.00');

    }
    var btnEdit = document.createElement('INPUT');
    btnEdit.setAttribute('type', 'button');
    btnEdit.setAttribute('value', 'SAVE');
    btnEdit.setAttribute('class', 'btn-post-now');
    btnEdit.setAttribute('onclick', 'editTicket()');
    var btnDelete = document.createElement('INPUT');
    btnDelete.setAttribute('type', 'button');
    btnDelete.setAttribute('value', 'DELETE');
    btnDelete.setAttribute('class', 'btn-post-now');
    btnDelete.setAttribute('onclick', 'deleteTicket()');
    divBtn.appendChild(btnEdit);
    divBtn.appendChild(btnDelete);
}

async function postTicket() {
    var ticket = {
        ticketCode: ticketInfo.ticketCode,
        transportationId: ticketInfo.transportationId,
        ticketTypeId: ticketInfo.ticketTypeId,
        departureStationId: ticketInfo.departureStationId,
        departureDateTime: ticketInfo.departureDateTime,
        arrivalStationId: ticketInfo.arrivalStationId,
        arrivalDateTime: ticketInfo.arrivalDateTime,
        sellingPrice: ticketInfo.sellingPrice
    }
    const res = await Post('api/ticket', ticket);
}

async function editTicket() {
    var ticket = {
        id: ticketId,
        ticketCode: document.getElementById('ticketCode').value,
        transportationId: ticketInfo.transportationId,
        ticketTypeId: ticketInfo.ticketTypeId,
        departureStationId: ticketInfo.departureStationId,
        departureDateTime: moment(document.getElementById('departureDate').value).format('YYYY-MM-DD HH:mm'),
        arrivalStationId: ticketInfo.arrivalStationId,
        arrivalDateTime: moment(document.getElementById('arrivalDate').value).format('YYYY-MM-DD HH:mm'),
        sellingPrice: document.getElementById('sellingPrice').value.replace(/,/g, '').replace('$', ''),
        description: ''
    }
    const res = await Put('api/ticket', ticket);

}

async function deleteTicket() {
    const res = await Delete('api/ticket?ticketId=' + ticketId);
}

async function getTransportation() {
    var vehicleId = document.getElementById('select-vehicle').value;
    var transportation = document.getElementById('transportation');
    const res = await Get('api/transportation?vehicleId=' + vehicleId + '&transportationName=' + transportation.value);
    if (res.status === 200) {
        var data = await res.json();
        autocomplete(transportation, data, 'transportation');
    }
}

async function getTicketType() {
    var vehicleId = document.getElementById('select-vehicle').value;
    var ticketType = document.getElementById('ticketType');
    const res = await Get('api/ticketType?vehicleId=' + vehicleId + '&ticketTypeName=' + ticketType.value);
    if (res.status === 200) {
        var data = await res.json();
        autocomplete(ticketType, data, 'ticketType');
    }
}

async function getDepartureCity() {
    var departureCity = document.getElementById('departureCity');
    const res = await Get('api/city?name=' + departureCity.value);
    if (res.status === 200) {
        var data = await res.json();
        autocomplete(departureCity, data, 'departureCity');
    }
}

async function getDepartureStation() {
    var departureStation = document.getElementById('departureStation');
    var cityId = ticketInfo.departureCityId;
    const res = await Get('api/station?cityId=' + cityId + '&name=' + departureStation.value);
    if (res.status === 200) {
        var data = await res.json();
        autocomplete(departureStation, data, 'departureStation');
    }
}

function setDepartureDate() {
    ticketInfo.departureDateTime = moment(document.getElementById('departureDate').value).format('YYYY-MM-DD HH:mm')
}

async function getArrivalCity() {
    var arrivalCity = document.getElementById('arrivalCity');
    const res = await Get('api/city?name=' + arrivalCity.value);
    if (res.status === 200) {
        var data = await res.json();
        autocomplete(arrivalCity, data, 'arrivalCity');
    }
}

async function getArrivalStation() {
    var arrivalStation = document.getElementById('arrivalStation');
    var cityId = ticketInfo.arrivalCityId;
    const res = await Get('api/station?cityId=' + cityId + '&name=' + arrivalStation.value);
    if (res.status === 200) {
        var data = await res.json();
        autocomplete(arrivalStation, data, 'arrivalStation');
    }
}

function setArrivalDate() {
    ticketInfo.arrivalDateTime = moment(document.getElementById('arrivalDate').value).format('YYYY-MM-DD HH:mm')
}

function setTicketCode() {
    var ticketCode = document.getElementById('ticketCode');
    ticketCode.value = ticketCode.value.toUpperCase();
    ticketInfo.ticketCode = ticketCode.value;
}

/* start format currency */
function onKeyUp(input) {
    formatCurrency(input);
}

function onBlur(input) {
    formatCurrency(input, "blur");
}

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
    ticketInfo.sellingPrice = input_val.replace(/,/g, '').replace('$', '');
}
/* end format currency */

function autocomplete(input, array, inputType) {
    if (inputType === 'departureCity') {
        var arrivalCityId = ticketInfo.arrivalCityId;
        if (arrivalCityId !== -1) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].id == arrivalCityId) {
                    array.splice(i, 1);
                }
            }
        }
    } else if (inputType === 'arrivalCity') {
        var departureCityId = ticketInfo.departureCityId;
        if (departureCityId !== -1) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].id == departureCityId) {
                    array.splice(i, 1);
                }
            }
        }
    }
    var currentFocus;
    var divItems, divItemMatch, i, val = input.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    divItems = document.createElement("DIV");
    divItems.setAttribute("id", input.id + "autocomplete-list");
    divItems.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    input.parentNode.appendChild(divItems);
    /*for each item in the array...*/
    for (i = 0; i < array.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (array[i].name.toUpperCase().indexOf(val.toUpperCase()) != -1) {
            /*create a DIV element for each matching element:*/
            divItemMatch = document.createElement("DIV");
            /*make the matching letters bold:*/
            // divItemMatch.innerHTML = "<strong>" + array[i].name.substr(0, val.length) + "</strong>";
            // divItemMatch.innerHTML += array[i].name.substr(val.length);

            divItemMatch.innerHTML = array[i].name;
            /*insert a input field that will hold the current array item's value:*/
            divItemMatch.innerHTML += "<input type='hidden' value='" + array[i].name + "' data-id='" + array[i].id + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            divItemMatch.addEventListener("click", function (e) {
                /*insert the value for the autocomplete text field:*/
                input.value = this.getElementsByTagName("input")[0].value;
                var ticketInfoId = this.getElementsByTagName("input")[0].getAttribute('data-id');
                setTicketInfo(ticketInfoId);
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            divItems.appendChild(divItemMatch);
        }
    }

    function setTicketInfo(ticketInfoId) {
        switch (inputType) {
            case 'transportation':
                ticketInfo.transportationId = ticketInfoId;
                return;
            case 'ticketType':
                ticketInfo.ticketTypeId = ticketInfoId;
                return;
            case 'departureCity':
                ticketInfo.departureCityId = ticketInfoId;
                return;
            case 'departureStation':
                ticketInfo.departureStationId = ticketInfoId;
                return;
            case 'arrivalCity':
                ticketInfo.arrivalCityId = ticketInfoId;
                return;
            case 'arrivalStation':
                ticketInfo.arrivalStationId = ticketInfoId;
                return;
            default:
                return;

        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var autoItems = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < autoItems.length; i++) {
            if (elmnt != autoItems[i] && elmnt != input) {
                autoItems[i].parentNode.removeChild(autoItems[i]);
            }
        }
    }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
//post, edit Ticket
