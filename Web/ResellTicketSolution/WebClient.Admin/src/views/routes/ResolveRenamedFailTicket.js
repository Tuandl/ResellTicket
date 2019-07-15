import Axios from 'axios';
import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Link } from 'react-router-dom';
import { Badge, Button, Card, CardBody, CardHeader, Col, Input, Row, Table } from 'reactstrap';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import TicketStatus from '../Tickets/TicketStatus';
import ResolveOption from './ResolveOption'

function TicketRow(props) {
    const { ticket } = props;
    const getBadge = (status) => {
        if (status === TicketStatus.Valid) {
            return (
                <Badge color="success">Valid</Badge>
            )
        }
    }
    const ticketLink = `/boughtRoute/replaceTicket/${ticket.id}`;

    function replaceTicket() {
        props.selectTicket(ticket.id);
    }

    return (
        <tr>
            <th>{props.index + 1}</th>
            <td>{ticket.ticketCode}</td>
            <td>{ticket.departureCityName}</td>
            <td>{moment(ticket.departureDateTime).format('ddd, MMM DD YYYY, HH:mm')}</td>
            <td>{ticket.arrivalCityName}</td>
            <td>{moment(ticket.arrivalDateTime).format('ddd, MMM DD YYYY, HH:mm')}</td>
            {/* <td>{ticket.sellerPhone}</td> */}
            <td>{ticket.vehicleName}</td>
            <td>{<NumberFormat value={ticket.sellingPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</td>
            <td>
                <Button color="success">
                    <i className="fa fa-edit fa-lg mr-1"></i>Details
                </Button>
            </td>
            <td style={{ paddingLeft: 50 }}>
                <Input type="radio" name="replace" value={ticket.id} onChange={() => replaceTicket()} />
            </td>
        </tr>
    )
}

export default class ResolveRenamedFailTicket extends Component {

    failRouteTicketId = 0;
    routeId = 0;


    constructor(props) {
        super(props)
        this.state = {
            routeTickets: [],
            //ticketCount: 0,
            isResolveNeed: false,
            replaceTickets: [],
            resolveOption: 0,
            routeStatus: 0,
            replaceTicketId: 0
        }
    }

    componentWillReceiveProps(props) {
        this.routeId = props.routeId;
        this.setState({
            routeTickets: props.routeTickets,
            //ticketCount: props.routeTickets.length,
            resolveOption: props.resolveOption,
            routeStatus: props.routeStatus
        }, () => {
            if (props.routeStatus === 2) this.checkResovleNeed(this.state.routeTickets);
        })
    }

    checkResovleNeed = (routeTickets) => {
        var renamedFailCount = 0;
        routeTickets.forEach(routeTicket => {
            if (routeTicket.status === TicketStatus.RenamedFail) renamedFailCount++;
        });
        this.setState({
            isResolveNeed: renamedFailCount >= 1 ? true : false
        })
    }

    optionChange = (event) => {
        var { routeTickets } = this.state;
        var optionValue = parseInt(event.target.value);
        switch (optionValue) {
            case 1: 
                this.props.onOptionChange(optionValue)
                //this.getReplaceTicket();
                var failTickets = 0;
                for (var i = 0; i < routeTickets.length; i++) {
                    if (routeTickets[i].status === TicketStatus.RenamedFail) {
                        failTickets++;
                        this.failRouteTicketId = routeTickets[i].id;
                    }
                }
                if (failTickets === 1) {
                    this.getReplaceTicketForFailTicket(this.failRouteTicketId);
                }
                break;
            case 2:
                this.setState({
                    replaceTickets: []
                })
                this.props.onOptionChange(optionValue)
                break;
            case 3:
                this.setState({
                    replaceTickets: []
                })
                this.props.onOptionChange(optionValue)
                break;
            default:
                break;
        }
    }

    getReplaceTicketForFailTicket = async (failRouteTicketId) => {
        var res = await Axios.get('api/ticket/replaceOneFail?failRouteTicketId=' + failRouteTicketId);
        if (res.status === 200) {
            this.setState({
                replaceTickets: res.data.data
            })
        }
    }

    onSelectTicket = (replaceTicketId) => {
        this.setState({
            replaceTicketId: replaceTicketId
        })
    }

    onReplaceTicket = async () => {
        var res = await Axios.post('api/route/replaceOneFail?routeId=' + this.routeId +
            '&failRouteTicketId=' + this.failRouteTicketId + '&replaceTicketId=' + this.state.replaceTicketId);
        if (res.status === 200) {
            toastr.success('Replace Success', 'Replace ticket successfully.');
            this.props.getRouteDetail()
        }

    }

    render() {
        var { replaceTickets, resolveOption, isResolveNeed, replaceTicketId } = this.state;
        return (
            isResolveNeed ? //Bought Routes
                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                &nbsp;&nbsp;&nbsp;<Input type="radio" name="option" value="1" onChange={this.optionChange} />
                                <strong>OPTION 1: Replace fail ticket to a new ticket.</strong>
                            </CardHeader>
                            {replaceTickets.length > 0 ?
                                <CardBody>
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
                                                <th>Action</th>
                                                <th>Select</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {replaceTickets.map((ticket, index) => (
                                                <TicketRow key={index} ticket={ticket} index={index} selectTicket={this.onSelectTicket} />
                                            ))}
                                        </tbody>
                                    </Table>
                                    {replaceTicketId !== 0 ?
                                        <Row className="float-right">
                                            <Col xs="12">
                                                <Button type="button" color="primary" onClick={this.onReplaceTicket}>Replace Ticket</Button>
                                            </Col>
                                        </Row>
                                        : null
                                    }

                                </CardBody> : null
                            }
                        </Card>
                    </Col>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                &nbsp;&nbsp;&nbsp;<Input type="radio" name="option" value="2" onChange={this.optionChange} />
                                <strong>OPTION 2: Refund the fail ticket's price to buyer and buyer will buy a new ticket by themselves.</strong>
                            </CardHeader>
                        </Card>
                    </Col>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                &nbsp;&nbsp;&nbsp;<Input type="radio" name="option" value="3" onChange={this.optionChange} />
                                <strong>OPTION 3: Refund the route's total amount to buyer.</strong>
                            </CardHeader>
                        </Card>
                    </Col>
                </Row> //Bouhgt Routes
                :
                //Completed Routes
                <Row>
                    {resolveOption === ResolveOption.REPLACE ?
                        <Col xl={12}>
                            <Card>
                                <CardHeader>
                                    &nbsp;&nbsp;&nbsp;<Input type="radio" name="option" value="1" checked="checked" disabled />
                                    <strong>OPTION 1: Replace fail ticket to a new ticket.</strong>
                                </CardHeader>
                                {replaceTickets.length > 0 ?
                                    <CardBody>
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
                                                    <th>Action</th>
                                                    <th>Select</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {replaceTickets.map((ticket, index) => (
                                                    <TicketRow key={index} ticket={ticket} index={index} replaceTicket={this.replaceTicket} />
                                                ))}
                                            </tbody>
                                        </Table>
                                    </CardBody> : null
                                }
                            </Card>
                        </Col> : null
                    }
                    {resolveOption === ResolveOption.REFUNDFAILTICKET ?
                        <Col xl={12}>
                            <Card>
                                <CardHeader>
                                    &nbsp;&nbsp;&nbsp;<Input type="radio" name="option" value="2" checked="checked" disabled />
                                    <strong>OPTION 2: Refund the fail ticket's price to buyer and buyer will buy a new ticket by themselves.</strong>
                                </CardHeader>
                            </Card>
                        </Col> : null
                    }
                    {resolveOption === ResolveOption.REFUNDTOTALAMOUNT ?
                        <Col xl={12}>
                            <Card>
                                <CardHeader>
                                    &nbsp;&nbsp;&nbsp;<Input type="radio" name="option" value="3" onChange={this.optionChange} checked="checked" disabled />
                                    <strong>OPTION 3: Refund the route's total amount to buyer.</strong>
                                </CardHeader>
                            </Card>
                        </Col> : null
                    }
                </Row>
            //Completed Routes
        )
    }
}