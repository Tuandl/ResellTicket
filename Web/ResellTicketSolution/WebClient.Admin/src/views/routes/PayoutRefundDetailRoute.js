import Axios from 'axios';
import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Badge, Button, Card, CardBody, CardHeader, Col, Input, Row, Table, FormGroup, Label } from 'reactstrap';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import TicketStatus from '../Tickets/TicketStatus';
import ResolveRenamedFailTicket from './ResolveRenamedFailTicket';

function TicketRow(props) {
    const { ticket, routeStatus } = props;
    const getBadge = (status) => {
        switch (status) {
            case TicketStatus.RenamedFail:
                return (
                    <Badge color="danger">RenamedFail</Badge>
                )
            case TicketStatus.RenamedSuccess:
                return (
                    <Badge color="success">RenamedSuccess</Badge>
                )
            case TicketStatus.Renamed:
                return (
                    <Badge color="success">Renamed</Badge>
                )
            case TicketStatus.Bought:
                return (
                    <Badge color="success">Bought</Badge>
                )
            case TicketStatus.Completed:
                return (
                    <Badge color="success">RenamedSuccess</Badge>
                )
            default:
                break;
        }
    }

    const getButton = (status) => {
        switch (status) {
            case TicketStatus.RenamedFail:
                if (routeStatus !== 3) {
                    return (
                        <Button color="danger" className="mr-2" onClick={refundMoneyToBuyer}>
                            <i className="fa fa-dollar fa-lg mr-1"></i>Refund
                        </Button>
                    )
                }
                break;
            case TicketStatus.RenamedSuccess:
                return (
                    <Button color="success" className="mr-2" onClick={tranferMoneyToSeller}>
                        <i className="fa fa-dollar fa-lg mr-1"></i>Payout
                    </Button>
                )
            default:
                break;
        }
    }

    function tranferMoneyToSeller() {
        props.tranferMoneyToSeller(ticket.ticketId)

    }

    function refundMoneyToBuyer() {
        console.log('refund')
    }

    return (
        <tr>
            <th>{props.index + 1}</th>
            <td>{ticket.ticketCode}</td>
            <td>{ticket.departureCityName}</td>
            <td>{moment(ticket.departureDateTime).format('ddd, MMM DD YYYY, HH:mm')}</td>
            <td>{ticket.arrivalCityName}</td>
            <td>{moment(ticket.arrivalDateTime).format('ddd, MMM DD YYYY, HH:mm')}</td>
            <td>{ticket.vehicleName}</td>
            <td>{<NumberFormat value={ticket.sellingPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} />}</td>
            <td>{getBadge(ticket.status)}</td>
            <td>
                {getButton(ticket.status)}
            </td>
        </tr>
    )
}

class PayoutRefundDetailRoute extends Component {

    constructor(props) {
        super(props);
        this.state = {
            routeDetail: [],
            routeTickets: [],
            routeStatus: 0,
            isRefundAll: false
        }
    }

    componentDidMount() {
        this.getRouteDetail();
    }

    getRouteDetail = async () => {
        const routeId = this.props.match.params.id;
        await Axios.get('api/route/detail?routeId=' + routeId).then(res => {
            this.setState({
                routeDetail: [
                    { name: 'Buyer Phone', value: res.data.buyerPhone },
                    { name: 'Route Code', value: res.data.code },
                    { name: 'Total Amount', value: '$' + res.data.totalAmount },
                ],
                routeStatus: res.data.status,
                routeTickets: res.data.routeTickets,
            }, () => this.checkRefundAll())
        });
    }

    checkRefundAll() {
        var { routeTickets } = this.state;
        for (var i = 0; i < routeTickets.length; i++) {
            if (routeTickets[i].status === TicketStatus.RenamedSuccess) {
                this.setState({
                    isRefundAll: false
                })
                break;
            } else if (routeTickets[i].status === TicketStatus.RenamedFail) {
                this.setState({
                    isRefundAll: true
                })
            }
        }

    }

    tranferMoneyToSeller = (ticketId) => {
        Axios.post('api/payout?ticketId=' + ticketId).then(res => {
            if (res.status === 200) {
                toastr.success('Payout Success', 'Tranfer money successfully.');
                this.getRouteDetail();
            }
        })
    }

    // refundMoneyToBuyer = (ticketId) => {
    //     Axios.post('api/one-ticket?ticketId=' + ticketId).then(res => {
    //         if(res.status === 200) {
    //             toastr.success('Refund Success', 'Refund money successfully.');    
    //             this.getRouteDetail();          
    //         }
    //     })
    // }

    refundTotalAmountToBuyer = () => {
        const ticketId = this.state.routeTickets[0].ticketId;
        Axios.post('api/refund/all-ticket?ticketId=' + ticketId).then(res => {
            if (res.status === 200) {
                toastr.success('Refund Success', 'Refund money successfully.');
                this.props.history.push('/boughtRoutes');
                //this.getRouteDetail();          
            }
        })
    }

    render() {
        const { routeDetail, routeTickets, isRefundAll, routeStatus } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                <strong><i className="icon-info pr-1"></i>Route Detail</strong>
                            </CardHeader>
                            <CardBody>
                                {routeDetail.map((detail, index) => (
                                    <Row key={index}>
                                        <Col md="6" xs="12">
                                            <FormGroup>
                                                <Label htmlFor={detail.name}>{detail.name}</Label>
                                                <Input type="text" disabled value={detail.value}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="6" xs="12">
                                        </Col>
                                    </Row>
                                ))}

                                <Table responsive hover>
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Code</th>
                                            <th>Departure</th>
                                            <th>Departure Time</th>
                                            <th>Arrival</th>
                                            <th>Arrival Time</th>
                                            <th>Vehicle</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {routeTickets.map((ticket, index) => (
                                            <TicketRow key={index} ticket={ticket} index={index} routeStatus={routeStatus}
                                                tranferMoneyToSeller={this.tranferMoneyToSeller}
                                                refundMoneyToBuyer={this.refundMoneyToBuyer}
                                            />
                                        ))}
                                    </tbody>
                                </Table>
                                <Row className="float-right">
                                    <Col xs="12">
                                        {
                                            routeStatus !== 3 && isRefundAll ?
                                                <Button color="danger" className="mr-2" onClick={this.refundTotalAmountToBuyer}>
                                                    <i className="fa fa-dollar fa-lg mr-1"></i>Refund Total Amount
                                                </Button> : ''
                                        }
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>


                <ResolveRenamedFailTicket routeTickets={routeTickets} />

            </div>
        )
    }
}

export default PayoutRefundDetailRoute;