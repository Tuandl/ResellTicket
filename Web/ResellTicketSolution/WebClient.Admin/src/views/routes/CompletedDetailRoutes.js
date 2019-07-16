import Axios from 'axios';
import React, { Component } from 'react';
// import { toastr } from 'react-redux-toastr';
import { Link } from 'react-router-dom';
import { Badge, Button, Card, CardBody, CardHeader, Col, Form, Input, InputGroup, Row, Table, FormGroup, Label } from 'reactstrap';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import TicketStatus from '../Tickets/TicketStatus';
import ResolveOption from './ResolveOption';

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

export default class CompletedDetailTicket extends Component {
    constructor(props) {
        super(props)
        this.state = {
            routeTickets: [],
            ticketCount: 0,
            isResovleNeed: false,
            replaceTickets: [],
            resolveOption: 0,
        }

    }