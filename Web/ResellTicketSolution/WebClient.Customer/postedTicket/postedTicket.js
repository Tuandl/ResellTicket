// import { Get, baseUrl } from '../helper/Api'
const baseUrl = 'http://localhost:59152/';

async function getPostedTicket() {
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
        const res = await fetch(baseUrl + 'api/ticket?customerId=' + 1 + '&page=' + 1);
        if (res.status === 200) {
            res.json().then(data => {
                this.setState({
                    tickets: data
                })
            })
        }
    }

    render() {
        var { tickets } = this.state
        return (
            tickets.map((item, index) => {
                var labelStatus = item.status === 1 ? 'label label-warning' : item.status === 3 ? 'label label-danger' : 'label label-success'
                return (
                    <div className="row" key={index} style={{ marginBottom: 50, }}>
                        <h3 style={{ color: '#fab005' }}>
                            <span>{item.departureCityName}  </span>
                            <i className="fa fa-long-arrow-right"></i>
                            <span>  {item.arrivalCityName}</span>
                        </h3>

                        <div className="col-md-12 route">
                            <div className="routeHeader">
                                <div className="col-md-2">
                                    <h4><b>Route</b></h4>
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
                                    <h3>{item.sellingPrice} $</h3>
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
