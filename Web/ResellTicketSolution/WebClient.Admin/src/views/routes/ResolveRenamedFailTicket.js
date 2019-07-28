import Axios from 'axios';
import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Link } from 'react-router-dom';
import {
    Badge, Button, Card, CardBody, CardHeader, Col, Input, Row, Table,
    Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import TicketStatus from '../Tickets/TicketStatus';
import ResolveOption from './ResolveOption'
import RouteStatus from './RouteStatus';

function TicketRow(props) {
    const { ticket } = props;
    // const getBadge = (status) => {
    //     if (status === TicketStatus.Valid) {
    //         return (
    //             <Badge color="success">Valid</Badge>
    //         )
    //     }
    // }
    const ticketLink = `/boughtRoute/${props.routeId}/${ticket.id}`;

    function replaceTicket() {
        props.selectTicket(ticket.id);
    }

    return (
        <tr>
            <th>{props.index + 1}</th>
            <td>{ticket.ticketCode}</td>
            <td>{ticket.departureCityName} - {moment(ticket.departureDateTime).format('ddd, MMM DD YYYY, HH:mm')}</td>
            <td>{ticket.arrivalCityName} - {moment(ticket.arrivalDateTime).format('ddd, MMM DD YYYY, HH:mm')}</td>
            {/* <td>{ticket.sellerPhone}</td> */}
            <td>{ticket.vehicleName}</td>
            <td>{<NumberFormat value={ticket.sellingPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</td>
            <td>
                <Link to={ticketLink}>
                    <Button color="secondary">
                        <i className="fa fa-edit fa-lg mr-1"></i>Details
                    </Button>
                </Link>
            </td>
            <td style={{ paddingLeft: 50 }}>
                <Input type="radio" name="replace" value={ticket.id} onChange={() => replaceTicket()} />
            </td>
        </tr>
    )
}

export default class ResolveRenamedFailTicket extends Component {

    failRouteTicketId = 0;
    failRouteTicketCode = '';
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
            replaceTicketId: 0,
            resolveOptionLogs: [],
            isRefundedAll: false,
            isOpenConfirmReplaceDialog: false,
        }
    }

    componentWillReceiveProps(props) {
        this.routeId = props.routeId;
        this.setState({
            routeTickets: props.routeTickets,
            //ticketCount: props.routeTickets.length,
            resolveOption: props.resolveOption,
            routeStatus: props.routeStatus,
            resolveOptionLogs: props.resolveOptionLogs,
            isRefundedAll: props.isRefundedAll
        }, () => {
            if (props.routeStatus === RouteStatus.Bought) this.checkResovleNeed(this.state.routeTickets)
            else this.setState({ isResolveNeed: false });
        })
    }

    componentDidMount() {
        // var failTickets = 0;
        // for (var i = 0; i < routeTickets.length; i++) {
        //     if (routeTickets[i].status === TicketStatus.RenamedFail) {
        //         failTickets++;
        //         this.failRouteTicketCode = routeTickets[i].ticketCode;
        //         this.failRouteTicketId = routeTickets[i].id;
        //         break;
        //     }
        // }
        // if (failTickets === 1) {
        //     this.getReplaceTicketForFailTicket(this.failRouteTicketId);
        // }
    }

    checkResovleNeed = (routeTickets) => {
        var renamedFailCount = 0;
        routeTickets.forEach(routeTicket => {
            if (routeTicket.status === TicketStatus.RenamedFail){renamedFailCount++;} 
            else if(routeTicket.status === TicketStatus.RenamedSuccess || routeTicket.status === TicketStatus.Renamed)
            {
                renamedFailCount = 0; 
                return;
            }
        });
        this.setState({
            isResolveNeed: renamedFailCount >= 1 ? true : false
        })
    }

    optionChange = (event) => {
        var { routeTickets } = this.state;
        var optionValue = parseInt(event.target.value);
        switch (optionValue) {
            case ResolveOption.REPLACE:
                this.props.onOptionChange(optionValue)
                //this.getReplaceTicket();
                var failTickets = 0;
                for (var i = 0; i < routeTickets.length; i++) {
                    if (routeTickets[i].status === TicketStatus.RenamedFail) {
                        failTickets++;
                        this.failRouteTicketCode = routeTickets[i].ticketCode;
                        this.failRouteTicketId = routeTickets[i].id;
                        break;
                    }
                }
                if (failTickets === 1) {
                    this.getReplaceTicketForFailTicket(this.failRouteTicketId);
                }
                break;
            case ResolveOption.REFUNDFAILTICKET:
                this.setState({
                    replaceTickets: []
                })
                this.props.onOptionChange(optionValue)
                break;
            case ResolveOption.REFUNDTOTALAMOUNT:
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
        this.closeConfirmReplaceDialog()
        toastr.info('Processing', 'Waiting for replace')
        var res = await Axios.post('api/route/replaceOneFail?routeId=' + this.routeId +
            '&failRouteTicketId=' + this.failRouteTicketId + '&replaceTicketId=' + this.state.replaceTicketId);
        if (res.status === 200) {
            toastr.success('Successfully', 'Replace ticket successfully.');
            this.props.getRouteDetail();
            this.setState({
                resolveOption: 0,
                replaceTickets: []
            })
        }

    }

    render() {
        return (
            <div>
                {this.renderResolveOption()}
                {this.renderResolveOptionLogs()}
                {this.renderConfirmReplaceDialog()}
            </div>
        )
    }

    renderResolveOption = () => {
        var { replaceTickets, replaceTicketId, isResolveNeed } = this.state;
        if (isResolveNeed) {
            return (
                //Bought Routes
                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                &nbsp;&nbsp;&nbsp;<Input type="radio" name="option" value="1" onChange={this.optionChange}
                                />
                                <strong>OPTION 1: Replace fail ticket to a new ticket.</strong>
                            </CardHeader>
                            {replaceTickets.length > 0 ?
                                <CardBody>
                                    <span>Replace For Ticket <strong>{this.failRouteTicketCode}</strong></span>
                                    <Table responsive hover>
                                        <thead>
                                            <tr>
                                                <th>No.</th>
                                                <th>Code</th>
                                                <th>Departure</th>
                                                <th>Arrival</th>
                                                <th>Vehicle</th>
                                                <th>Price</th>
                                                <th>Action</th>
                                                <th>Select</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {replaceTickets.map((ticket, index) => (
                                                <TicketRow key={index} ticket={ticket} index={index} selectTicket={this.onSelectTicket} routeId={this.routeId} />
                                            ))}
                                        </tbody>
                                    </Table>
                                    {replaceTicketId !== 0 ?
                                        <Row className="float-right">
                                            <Col xs="12">
                                                <Button type="button" color="success" onClick={this.openConfirmReplaceDialog}>Replace Ticket</Button>
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
            )
        }
    }

    renderProfitOrLoss() {
        var { routeStatus } = this.state;
        var { earnedLoss } = this.props;
        if (routeStatus === RouteStatus.Completed) {
            if (parseFloat(earnedLoss) < 0) {
                return (
                    <Badge color="danger" style={{ float: 'right', fontSize: 15 }}>LOSS: ${earnedLoss * (-1)}</Badge>
                )
            } else {
                return (
                    <Badge color="success" style={{ float: 'right', fontSize: 15 }}>EARNED: ${earnedLoss}</Badge>
                )
            }
        }
    }

    renderResolveOptionLogs() {
        var { resolveOptionLogs } = this.state;
        if (resolveOptionLogs.length > 0) {

            return (
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardHeader>
                                <strong>Resolved Tickets History </strong>
                                {this.renderProfitOrLoss()}
                            </CardHeader>
                            <CardBody>
                                <Table responsive hover>
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Code</th>
                                            <th>Departure</th>
                                            <th>Arrival</th>
                                            <th>Price</th>
                                            <th>Updated At</th>
                                            <th>Status</th>
                                            <th>Result</th>
                                            <th>Staff</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resolveOptionLogs.map((resolveOptionLog, index) => (
                                            <tr key={index}>
                                                <td><strong>{index + 1}</strong></td>
                                                <td>{resolveOptionLog.resolvedTicketCode}</td>
                                                <td>{resolveOptionLog.departureCityName} <br /> {moment(resolveOptionLog.departureDateTime).format('ddd, MMM DD YYYY HH:mm')}</td>
                                                <td>{resolveOptionLog.arrivalCityName} <br /> {moment(resolveOptionLog.arrivalDateTime).format('ddd, MMM DD YYYY HH:mm')}</td>
                                                <td>${resolveOptionLog.sellingPrice}</td>
                                                <td>{moment(resolveOptionLog.resolveAt).format('ddd, MMM DD YYYY HH:mm')}</td>
                                                <td>
                                                    {resolveOptionLog.option === ResolveOption.REPLACE ?
                                                        <Badge color="secondary">Replaced by Ticket {resolveOptionLog.replacedTicketCode}</Badge>
                                                        : null
                                                    }
                                                    {resolveOptionLog.option === ResolveOption.REFUNDFAILTICKET ?
                                                        <Badge color="danger">Refunded</Badge>
                                                        : null
                                                    }
                                                    {resolveOptionLog.option === ResolveOption.REFUNDTOTALAMOUNT ?
                                                        <Badge color="danger">Refunded</Badge>
                                                        : null
                                                    }
                                                    {resolveOptionLog.option === ResolveOption.PAYOUT ?
                                                        <Badge color="success">Payout</Badge>
                                                        : null
                                                    }
                                                </td>
                                                <td>
                                                    <Badge color="danger">Lost: ${resolveOptionLog.amount}</Badge>
                                                </td>
                                                <td>{resolveOptionLog.staffName}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            )
        }
    }

    openConfirmReplaceDialog = () => {
        //this.resolvedTicketId = ticketId;
        this.setState({
            isOpenConfirmReplaceDialog: true
        })
    }

    closeConfirmReplaceDialog = () => {
        this.setState({
            isOpenConfirmReplaceDialog: false
        })
    }

    renderConfirmReplaceDialog = () => {
        return (
            <Modal isOpen={this.state.isOpenConfirmReplaceDialog}
                className="modal-success">
                <ModalHeader toggle={this.closeConfirmReplaceDialog}>Confirm Replace</ModalHeader>
                <ModalBody>
                    Do you want to replace this ticket?
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={this.onReplaceTicket}>Confirm</Button>
                    <Button color="secondary" onClick={this.closeConfirmReplaceDialog}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }
}