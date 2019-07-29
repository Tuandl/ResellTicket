import Axios from 'axios';
import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Link } from 'react-router-dom';
import {
    Badge, Button, Card, CardBody, CardHeader, Col, Input, Row, Table, FormGroup, Label,
    Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import TicketStatus from '../Tickets/TicketStatus';
import ResolveRenamedFailTicket from './ResolveRenamedFailTicket';
import RouteStatus from './RouteStatus';


function TicketRow(props) {
    const { routeTicket, routeStatus, resolveOption, isRefund } = props;
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
                if (routeStatus !== RouteStatus.Completed && resolveOption === 2 && isRefund) {
                    return (
                        <Button color="danger" className="mr-2" onClick={refundFailTicketMoneyToBuyer}>
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
        //props.tranferMoneyToSeller(routeTicket.ticketId)
        props.openConfirmPayoutDialog(routeTicket.ticketId)
    }

    function refundFailTicketMoneyToBuyer() {
        //props.refundFailTicketMoneyToBuyer(routeTicket.ticketId);
        props.openConfirmRefundDialog(routeTicket.ticketId)
    }

    const ticketLink = `/boughtRoute/${props.routeId}/${routeTicket.ticketId}`;

    return (
        <tr>
            <th>{props.index + 1}</th>
            <td>{routeTicket.ticketCode}</td>
            <td>{routeTicket.departureCityName} - {moment(routeTicket.departureDateTime).format('ddd, MMM DD YYYY, HH:mm')}</td>
            <td>{routeTicket.arrivalCityName} - {moment(routeTicket.arrivalDateTime).format('ddd, MMM DD YYYY, HH:mm')}</td>
            <td>{<NumberFormat value={routeTicket.sellingPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} />}</td>
            <td>{getBadge(routeTicket.status)}</td>
            <td>
                <Link to={ticketLink}>
                    <Button color="secondary mr-1">
                        <i className="fa fa-edit fa-lg mr-1"></i>Details
                    </Button>
                </Link>
                {getButton(routeTicket.status)}
            </td>
        </tr>
    )
}

class PayoutRefundDetailRoute extends Component {
    resolvedTicketId = 0;

    constructor(props) {
        super(props);
        this.state = {
            routeId: 0,
            routeDetail: [],
            routeTickets: [],
            resolveOption: 0,
            routeStatus: 0,
            isRefund: false,
            resolveOptionLogs: [],
            isRefundedAll: false,
            profitLoss: 0,

            isOpenConfirmPayoutDialog: false,
            isOpenConfirmRefundDialog: false,
            isOpenConfirmRefundAllDialog: false
        }
    }

    componentDidMount() {
        this.getRouteDetail();
    }

    getRouteDetail = async () => {
        const routeId = this.props.match.params.id;
        await Axios.get('api/route/detail?routeId=' + routeId).then(res => {
            this.setState({
                routeDetail:
                [
                    { name: 'Buyer Phone', value: res.data.buyerPhone },
                    { name: 'Route Code', value: res.data.code },
                    { name: 'Total Amount Earned', value: '$' + res.data.totalAmount }
                ],
                routeId: res.data.id,
                routeStatus: res.data.status,
                routeTickets: res.data.routeTickets,
                resolveOptionLogs: res.data.resolveOptionLogs,
                isRefundedAll: res.data.isRefundAll,
                earnedLoss: res.data.earnedLoss
            }, () => {
                this.checkRefundAll();
            })
        });
    }

    checkRefundAll() {
        var { routeTickets } = this.state;
        for (var i = 0; i < routeTickets.length; i++) {
            if (routeTickets[i].status === TicketStatus.RenamedSuccess || routeTickets[i].status === TicketStatus.Renamed) {
                this.setState({
                    isRefund: false
                })
                break;
            } else if (routeTickets[i].status === TicketStatus.RenamedFail) {
                this.setState({
                    isRefund: true
                })
            }
        }

    }

    tranferMoneyToSeller = () => {
        this.closeConfirmPayoutDialog();
        toastr.info('Processing, Waiting for tranfer');
        Axios.post('api/payout?ticketId=' + this.resolvedTicketId).then(res => {
            if (res.status === 200) {
                toastr.success('Successfully', 'Tranfer money successfully.');
                this.getRouteDetail();
            }
        })
    }

    refundFailTicketMoneyToBuyer = () => {
        this.closeConfirmRefundDialog();
        toastr.info('Processing, Waiting for refund');
        Axios.post('api/refund/one-ticket?ticketId=' + this.resolvedTicketId + '&resolveOption=' + this.state.resolveOption).then(res => {
            if (res.status === 200) {
                toastr.success('Successfully', 'Refund money successfully.');
                this.getRouteDetail();
            }
        })
    }

    refundTotalAmountToBuyer = () => {
        this.closeConfirmRefundAllDialog();
        toastr.info('Processing', 'Waiting for refund')
        const ticketId = this.state.routeTickets[0].ticketId;
        Axios.post('api/refund/all-ticket?ticketId=' + ticketId + '&resolveOption=' + this.state.resolveOption).then(res => {
            if (res.status === 200) {
                toastr.success('Successfully', 'Refund money successfully.');
                //this.props.history.push('/boughtRoutes');
                this.getRouteDetail();
            }
        })
    }

    onOptionChange = (value) => {
        this.setState({
            resolveOption: value
        })
    }

    goBack = () => {
        this.props.history.goBack();
    }

    render() {
        const { routeDetail,
            routeTickets,
            isRefund,
            routeStatus,
            resolveOption,
            routeId,
            resolveOptionLogs,
            isRefundedAll,
            earnedLoss } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                <strong>Route Detail</strong>
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
                                {routeTickets.length > 0 ?
                                    <Table responsive hover>
                                        <thead>
                                            <tr>
                                                <th>No.</th>
                                                <th>Code</th>
                                                <th>Departure</th>
                                                <th>Arrival</th>
                                                <th>Price</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {routeTickets.map((routeTicket, index) => (
                                                <TicketRow key={index} routeTicket={routeTicket} index={index} routeStatus={routeStatus}
                                                    // tranferMoneyToSeller={this.tranferMoneyToSeller}
                                                    // refundFailTicketMoneyToBuyer={this.refundFailTicketMoneyToBuyer}
                                                    resolveOption={resolveOption} isRefund={isRefund} routeId={routeId}
                                                    openConfirmPayoutDialog={this.openConfirmPayoutDialog}
                                                    openConfirmRefundDialog={this.openConfirmRefundDialog}
                                                />
                                            ))}
                                        </tbody>
                                    </Table>
                                    : null}
                                <Row className="float-right">
                                    <Col xs="12">
                                        {
                                            routeStatus !== 3 && resolveOption === 3 && isRefund ?
                                                <Button color="danger" className="mr-2" onClick={this.openConfirmRefundAllDialog}>
                                                    <i className="fa fa-dollar fa-lg mr-1"></i>Refund Total Amount
                                                </Button> : ''
                                        }
                                        <Button color="secondary" className="ml-1" onClick={() => this.goBack()}>Back</Button>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>


                <ResolveRenamedFailTicket routeTickets={routeTickets} resolveOption={resolveOption}
                    routeStatus={routeStatus} onOptionChange={this.onOptionChange} routeId={routeId}
                    getRouteDetail={this.getRouteDetail} resolveOptionLogs={resolveOptionLogs} isRefundedAll={isRefundedAll} 
                    earnedLoss={earnedLoss} />

                <div>
                    {this.renderConfirmPayoutDialog()}
                    {this.renderConfirmRefundDialog()}
                    {this.renderConfirmRefundAllDialog()}
                </div>

            </div>
        )
    }

    openConfirmPayoutDialog = (ticketId) => {
        this.resolvedTicketId = ticketId;
        this.setState({
            isOpenConfirmPayoutDialog: true
        })
    }

    closeConfirmPayoutDialog = () => {
        this.setState({
            isOpenConfirmPayoutDialog: false
        })
    }

    openConfirmRefundDialog = (ticketId) => {
        this.resolvedTicketId = ticketId;
        this.setState({
            isOpenConfirmRefundDialog: true
        })
    }

    closeConfirmRefundDialog = () => {
        this.setState({
            isOpenConfirmRefundDialog: false
        })
    }

    openConfirmRefundAllDialog = () => {
        //this.resolvedTicketId = ticketId;
        this.setState({
            isOpenConfirmRefundAllDialog: true
        })
    }

    closeConfirmRefundAllDialog = () => {
        this.setState({
            isOpenConfirmRefundAllDialog: false
        })
    }

    renderConfirmPayoutDialog = () => {
        return (
            <Modal isOpen={this.state.isOpenConfirmPayoutDialog}
                className="modal-success">
                <ModalHeader toggle={this.closeConfirmPayoutDialog}>Confirm Payout</ModalHeader>
                <ModalBody>
                    Do you want to confirm payout this ticket?
                                    </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={this.tranferMoneyToSeller}>Confirm</Button>
                    <Button color="secondary" onClick={this.closeConfirmPayoutDialog}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }

    renderConfirmRefundDialog = () => {
        return (
            <Modal isOpen={this.state.isOpenConfirmRefundDialog}
                className="modal-danger">
                <ModalHeader toggle={this.closeConfirmRefundDialog}>Confirm Refund</ModalHeader>
                <ModalBody>
                    Do you want to refund this ticket ?
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={this.refundFailTicketMoneyToBuyer}>Confirm</Button>
                    <Button color="secondary" onClick={this.closeConfirmRefundDialog}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }

    renderConfirmRefundAllDialog = () => {
        return (
            <Modal isOpen={this.state.isOpenConfirmRefundAllDialog}
                className="modal-danger">
                <ModalHeader toggle={this.closeConfirmRefundAllDialog}>Confirm Refund Total Amount</ModalHeader>
                <ModalBody>
                    Do you want to refund this route ?
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={this.refundTotalAmountToBuyer}>Confirm</Button>
                    <Button color="secondary" onClick={this.closeConfirmRefundAllDialog}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default PayoutRefundDetailRoute;