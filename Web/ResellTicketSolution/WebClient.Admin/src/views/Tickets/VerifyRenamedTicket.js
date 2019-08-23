import Axios from 'axios';
import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import {
    Button, Card, CardBody, CardHeader, Col, FormGroup, Label, Input, Row,
    Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';
import moment from 'moment';
// import NumberFormat from 'react-number-format';

export default class VerifyRenamedTicket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ticketDetail: {
                sellerPhone: '',
                ticketCode: '',
                vehicle: '',
                transportation: '',
                ticketType: '',
                departure: '',
                arrival: '',
                expiredDateTime: '',
                sellingPrice: '',
                buyerPassengerIdentify: '',
                buyerPassengerName: '',
                buyerPassengerEmail: '',
                buyerPassengerPhone: '',
                isShowConfirmDialogSuccess: false,
                isShowConfirmDialogFail: false
            }
        }
    }

    showConfirmDialogSuccess = () => {
        this.setState({
            isShowConfirmDialogSuccess: true
        });
    }

    closeConfirmDialogSuccess = () => {
        this.setState({
            isShowConfirmDialogSuccess: false
        });
    }

    showConfirmDialogFail = () => {
        this.setState({
            isShowConfirmDialogFail: true
        });
    }

    closeConfirmDialogFail = () => {
        this.setState({
            isShowConfirmDialogFail: false
        });
    }

    componentDidMount() {
        this.getTicketDetail();
    }

    getTicketDetail = async () => {
        const ticketId = this.props.match.params.id;
        const res = await Axios.get('api/ticket/detail?ticketId=' + ticketId);
        if (res.status === 200) {
            this.setState({
                ticketDetail: {
                    sellerPhone: res.data.sellerPhone,
                    ticketCode: res.data.ticketCode,
                    vehicle: res.data.vehicleName,
                    transportation: res.data.transportationName,
                    transportationPhone: res.data.transportationPhone,
                    ticketType: res.data.ticketTypeName,
                    departure: moment(res.data.departureDateTime).format('ddd, MMM DD YYYY, HH:mm') + "-" + res.data.departureStationName + "-" + res.data.departureCityName,
                    arrival: moment(res.data.arrivalDateTime).format('ddd, MMM DD YYYY, HH:mm') + "-" + res.data.arrivalStationName + "-" + res.data.arrivalCityName,
                    expiredDateTime: moment(res.data.expiredDateTime).format('ddd, MMM DD YYYY, HH:mm'),
                    sellingPrice: '$' + res.data.sellingPrice,
                    buyerPassengerName: res.data.buyerPassengerName,
                    buyerPassengerEmail: res.data.buyerPassengerEmail,
                    buyerPassengerIdentify: res.data.buyerPassengerIdentify,
                    buyerPassengerPhone: res.data.buyerPassengerPhone
                }
            })
        }
    }

    onRenamedSuccess = () => {
        toastr.info('Processing', 'Waiting for valid')
        var ticketId = this.props.match.params.id;
        var renamedSuccess = true;
        this.closeConfirmDialogSuccess();
        Axios.post('api/ticket/validate-rename?id=' + ticketId + '&renameSuccess=' + renamedSuccess).then(res => {
            if (res.status === 200) {
                toastr.success('Successfully', 'Ticket has been updated.');
                //this.getRenamedTickets();
                this.props.history.push('/renamedTicket');
            } else {
                toastr.error('Error', 'Error when valid Ticket');
            }
        })
    }

    onRenamedFail = () => {
        toastr.info('Processing', 'Waiting for valid')
        var ticketId = this.props.match.params.id;
        var renamedSuccess = false;
        this.closeConfirmDialogFail();
        Axios.post('api/ticket/validate-rename?id=' + ticketId + '&renameSuccess=' + renamedSuccess).then(res => {
            if (res.status === 200) {
                toastr.success('Successfully', 'Ticket has been updated.');
                //this.getRenamedTickets();
                this.props.history.push('/renamedTicket');
            } else {
                toastr.error('Error', 'Error when valid Ticket');
            }
        })
    }

    render() {
        var { ticketDetail } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                <strong>Ticket Detail</strong>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md="6" xs="12">
                                        <FormGroup>
                                            <Label htmlFor="">Buyer Passenger Phone</Label>
                                            <Input type="text" disabled value={ticketDetail.buyerPassengerPhone}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" xs="12">
                                        <FormGroup>
                                            <Label htmlFor="">Buyer Passenger Name</Label>
                                            <Input type="text" disabled value={ticketDetail.buyerPassengerName}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6" xs="12">
                                        <FormGroup>
                                            <Label htmlFor="">Buyer Passenger Email</Label>
                                            <Input type="text" disabled value={ticketDetail.buyerPassengerEmail}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" xs="12">
                                        <FormGroup>
                                            <Label htmlFor="">Buyer Passenger Indentify</Label>
                                            <Input type="text" disabled value={ticketDetail.buyerPassengerIdentify}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col md="6" xs="12">
                                        <FormGroup>
                                            <Label htmlFor="">Seller Phone</Label>
                                            <Input type="text" disabled value={ticketDetail.sellerPhone}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" xs="12"></Col>
                                </Row>
                                <Row>
                                    <Col md="6" xs="12">
                                        <FormGroup>
                                            <Label htmlFor="">Ticket Code</Label>
                                            <Input type="text" disabled value={ticketDetail.ticketCode}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" xs="12">
                                        <FormGroup>
                                            <Label htmlFor="">Vehicle</Label>
                                            <Input type="text" disabled value={ticketDetail.vehicle}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6" xs="12">
                                        <FormGroup>
                                            <Label htmlFor="">Transportation ({ticketDetail.transportationPhone})</Label>
                                            <Input type="text" disabled value={ticketDetail.transportation}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" xs="12">
                                        <FormGroup>
                                            <Label htmlFor="">Ticket Type</Label>
                                            <Input type="text" disabled value={ticketDetail.ticketType}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6" xs="12">
                                        <FormGroup>
                                            <Label htmlFor="">Departure</Label>
                                            <Input type="text" disabled value={ticketDetail.departure}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" xs="12">
                                        <FormGroup>
                                            <Label htmlFor="">Arrival</Label>
                                            <Input type="text" disabled value={ticketDetail.arrival}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6" xs="12">
                                        <FormGroup>
                                            <Label htmlFor="">Expired Date</Label>
                                            <Input type="text" disabled value={ticketDetail.expiredDateTime}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" xs="12">
                                        <FormGroup>
                                            <Label htmlFor="">Selling Price</Label>
                                            <Input type="text" disabled value={ticketDetail.sellingPrice}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className="float-right">
                                    <Col xs="12">
                                        <Button color="success" className="ml-1" onClick={this.showConfirmDialogSuccess}>Renamed Success</Button>
                                        <Button color="danger" className="ml-1" onClick={this.showConfirmDialogFail}>Renamed Fail</Button>
                                        <Button color="secondary" className="ml-1" onClick={() => { this.props.history.push('/renamedTicket') }}>Cancel</Button>
                                    </Col>
                                </Row>
                                <Modal isOpen={this.state.isShowConfirmDialogSuccess}
                                    className="modal-success">
                                    <ModalHeader toggle={this.closeConfirmDialogSuccess}>Confirm Renamed Ticket Success</ModalHeader>
                                    <ModalBody>
                                        Do you want to confirm this ticket renamed successfully ?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="success" onClick={this.onRenamedSuccess}>Confirm</Button>
                                        <Button color="secondary" onClick={this.closeConfirmDialogSuccess}>Cancel</Button>
                                    </ModalFooter>
                                </Modal>
                                <Modal isOpen={this.state.isShowConfirmDialogFail}
                                    className="modal-danger">
                                    <ModalHeader toggle={this.closeConfirmDialogFail}>Confirm Renamed Ticket Fail</ModalHeader>
                                    <ModalBody>
                                        Do you want to confirm this ticket renamed fail ?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" onClick={this.onRenamedFail}>Confirm</Button>
                                        <Button color="secondary" onClick={this.closeConfirmDialogFail}>Cancel</Button>
                                    </ModalFooter>
                                </Modal>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}