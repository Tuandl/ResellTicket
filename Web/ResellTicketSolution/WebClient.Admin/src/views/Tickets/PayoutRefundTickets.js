import Axios from 'axios';
import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Redirect, Link } from 'react-router-dom';
import { Badge, Button, Card, CardBody, CardHeader, Col, Form, Input, InputGroup, Row, Table, FormGroup, Label } from 'reactstrap';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import TicketStatus from './TicketStatus';

function TicketRow(props) {
    const { ticket } = props;
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
                    <Badge color="danger">RenamedSuccess</Badge>
                )
        }
    }

    const getButton = (status) => {
        switch (status) {
            case TicketStatus.RenamedFail:
                return (
                    <Button color="danger" className="mr-2" onClick={refundMoneyToBuyer}>
                        <i className="fa fa-dollar fa-lg mr-1"></i>Refund
                </Button>
                )
            case TicketStatus.RenamedSuccess:
                return (
                    <Button color="success" className="mr-2" onClick={tranferMoneyToSeller}>
                        <i className="fa fa-dollar fa-lg mr-1"></i>Payout
                    </Button>
                )
        }
    }

    function tranferMoneyToSeller() {
        props.tranferMoneyToSeller(ticket.id)

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
            <td>{ticket.sellerPhone}</td>
            <td>{<NumberFormat value={ticket.sellingPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</td>
            <td>{getBadge(ticket.status)}</td>
            <td>
                {getButton(ticket.status)}
            </td>
        </tr>
    )
}

class PayoutRefundTicket extends Component {

    constructor(props) {
        super(props);
        this.state = {
            routeDetail: [],
            routeTickets: [],
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
                routeTickets: res.data.routeTickets,
            }, () => this.checkRefundAll())
        });
    }

    checkRefundAll() {
        var { routeTickets } = this.state;
        routeTickets.forEach(ticket => {
            if (ticket.status === TicketStatus.RenamedFail) {
                this.setState({
                    isRefundAll: true
                })
                return;
            }
        });

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

    // refundTotalAmountToBuyer = () => {
    //     Axios.post('api/all-ticket?ticketId=' + ticketId).then(res => {
    //         if(res.status === 200) {
    //             toastr.success('Refund Success', 'Refund money successfully.');    
    //             this.getRouteDetail();          
    //         }
    //     })
    // }

    render() {
        const { routeDetail, routeTickets, isRefundAll } = this.state;
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
                                            <th>Seller Phone</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {routeTickets.map((ticket, index) => (
                                            <TicketRow key={index} ticket={ticket} index={index}
                                                tranferMoneyToSeller={this.tranferMoneyToSeller}
                                                refundMoneyToBuyer={this.refundMoneyToBuyer}
                                            />
                                        ))}
                                    </tbody>
                                </Table>
                                <Row className="float-right">
                                    <Col xs="12">
                                        {
                                            isRefundAll ?
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
            </div>
        )
    }
}

export default PayoutRefundTicket;