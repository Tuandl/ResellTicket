import Axios from 'axios';
import React, { Component } from 'react';
// import { toastr } from 'react-redux-toastr';
import { Link } from 'react-router-dom';
import { Badge, Button, Card, CardBody, CardHeader, Col, Form, Input, InputGroup, Row, Table, FormGroup, Label } from 'reactstrap';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import TicketStatus from '../Tickets/TicketStatus';

function TicketRow(props) {
    const { ticket } = props;
    const getBadge = (status) => {
        if (status === TicketStatus.Valid) {
            return (
                <Badge color="warning">Valid</Badge>
            )
        }
    }
    const ticketLink = `/newPostedTicket/${ticket.id}`
    return (
        <tr>
            <th>{props.index + 1}</th>
            <td>{ticket.ticketCode}</td>
            <td>{ticket.departureCity}</td>
            <td>{moment(ticket.departureDateTime).format('ddd, MMM DD YYYY, HH:mm')}</td>
            <td>{ticket.arrivalCity}</td>
            <td>{moment(ticket.arrivalDateTime).format('ddd, MMM DD YYYY, HH:mm')}</td>
            {/* <td>{ticket.sellerPhone}</td> */}
            {/* <th>{ticket.}</th> */}
            <td>{<NumberFormat value={ticket.sellingPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</td>
            <td>{getBadge(ticket.status)}</td>
            <td>
                <Link to={ticketLink}>
                    <Button color="success" className="mr-2">
                        <i className="fa fa-edit fa-lg mr-1"></i>Valid
                    </Button>
                </Link>
            </td>
        </tr>


    )
}

export default class ResolveRenamedFailTicket extends Component {
    constructor(props) {
        super(props)
        this.state = {
            routeTickets: [],
            ticketCount: 0,
            isResovleNeed: false,
            replaceTickets: []
        }

    }

    componentWillReceiveProps(props) {
        this.setState({
            routeTickets: props.routeTickets,
            ticketCount: props.routeTickets.length
        }, () => this.checkResovleNeed(this.state.routeTickets))
    }

    checkResovleNeed = (routeTickets) => {
        var renamedSuccessCount = 0;
        var renamedFailCount = 0;
        routeTickets.forEach(routeTicket => {
            if (routeTicket.status === TicketStatus.RenamedSuccess) renamedSuccessCount++;
            else renamedFailCount++;
        });
        if (renamedFailCount >= 1) {
            this.setState({
                isResovleNeed: true
            })
        }
    }

    optionChange = (event) => {
        var optionValue = parseInt(event.target.value);
        switch (optionValue) {
            case 1:
                this.props.onOptionChange(optionValue)
                //this.getReplaceTicket();
                break;
            case 2:
                this.props.onOptionChange(optionValue)
                break;
            case 3:
                this.props.onOptionChange(optionValue)
                break;
            default:
                break;
        }
    }

    getReplaceTicket = async () => {
        var { routeTickets } = this.state;
        var res = await Axios.get('api/ticket/replaceTicket?routeTicketId=' + routeTickets[0].id);
        if (res.status === 200) {
            this.setState({
                replaceTickets: res.data.data
            })
        }
    }

    render() {
        var { replaceTickets } = this.state;
        return (
            this.state.isResovleNeed ?
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
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* {replaceTickets.map((ticket, index) => (
                                                    <TicketRow key={index} ticket={ticket} index={index} parent={this} />
                                                ))} */}
                                        </tbody>
                                    </Table>
                                </CardBody> : null
                            }
                        </Card>
                    </Col>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                &nbsp;&nbsp;&nbsp;<Input type="radio" name="option" value="2" onChange={this.optionChange} />
                                <strong>OPTION 2: Refund the fail ticket's price to buyer
                                        and buyer will buy a new ticket by themselves.</strong>
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
                </Row> : ''
        )
    }
}