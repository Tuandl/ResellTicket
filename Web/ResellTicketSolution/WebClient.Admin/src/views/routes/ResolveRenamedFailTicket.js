import Axios from 'axios';
import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Badge, Button, Card, CardBody, CardHeader, Col, Form, Input, InputGroup, Row, Table, FormGroup, Label } from 'reactstrap';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import TicketStatus from '../Tickets/TicketStatus';

export default class ResolveRenamedFailTicket extends Component {
    constructor(props) {
        super(props)
        this.state = {
            routeTickets: [],
            ticketCount: 0,
            isResovleNeed: false,

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
        if (renamedSuccessCount >= 1 && renamedFailCount >= 1) {
            this.setState({
                isResovleNeed: true
            })
        }
    }

    optionChange = (event) => {
        console.log(event.target)
    }

    render() {
        return (
            this.state.isResovleNeed ?
                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                <strong>Resolve RenamedFail Tickets</strong>
                            </CardHeader>
                            <CardBody>
                                <Row style={{ marginBottom: 50 }}>
                                    <Col xs="4">
                                        <span style={{ display: 'block' }}>
                                            <strong>
                                                OPTION 1: Replace fail ticket to a new ticket.
                                            </strong>
                                        </span>
                                    </Col>
                                    <Col xs="4">
                                        <Input type="radio" name="option" value="option1" onChange={this.optionChange}/>
                                    </Col>
                                </Row>
                                <Row></Row>
                                <Row style={{ marginBottom: 50 }}>
                                    <Col xs="4">
                                        <span style={{ display: 'block' }}>
                                            <strong>
                                                OPTION 2: Refund the fail ticket's price to buyer
                                                and buyer will buy a new ticket by themselves.
                                            </strong>
                                        </span>
                                    </Col>
                                    <Col xs="4">
                                        <Input type="radio" name="option" value="option2" onChange={this.optionChange}/>
                                    </Col>
                                </Row>
                                <Row></Row>
                                <Row style={{ marginBottom: 50 }}>
                                    <Col xs="4">
                                        <span style={{ display: 'block' }}>
                                            <strong>
                                                OPTION 3: Refund the route's total amount to buyer.
                                            </strong>
                                        </span>
                                    </Col>
                                    <Col xs="4">
                                        <Input type="radio" name="option" value="option3" onChange={this.optionChange}/>
                                    </Col>
                                </Row>
                                <Row></Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row> : ''
        )
    }
}