import Axios from 'axios';
import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import {
    Button, Card, CardBody, CardHeader, Col, FormGroup, Label, Input,
    Row, Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';
import moment from 'moment';
// import NumberFormat from 'react-number-format';

export default class ValidTicketDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ticketDetails: [],
            radioName: '',
            validCount: 0,
            invalidCount: 0,
            invalidField: '',
            commissionFee: 10,
            expiredBefore: '0', //hours
            expiredDateTime: '',
            sellerPhone: '',
            isShowConfirmDialog: false
        }

    }

    componentDidMount() {
        this.getTicketDetail();
    }

    showConfirmDialog = () => {
        this.setState({
            isShowConfirmDialog: true
        });
    }

    closeConfirmDialog = () => {
        this.setState({
            isShowConfirmDialog: false
        });
    }

    getTicketDetail = async () => {
        const ticketId = this.props.match.params.id;
        const res = await Axios.get('api/ticket/detail?ticketId=' + ticketId);
        if (res.status === 200) {
            this.setState({
                ticketDetails: [
                    { name: "Ticket Code", value: res.data.ticketCode },
                    { name: "Vehicle", value: res.data.vehicleName },
                    { name: "Transportation", value: res.data.transportationName },
                    { name: "Ticket Type", value: res.data.ticketTypeName },
                    { name: "Departure", value: moment(res.data.departureDateTime).format('ddd, MMM DD YYYY, HH:mm') + "-" + res.data.departureStationName + "-" + res.data.departureCityName },
                    { name: "Arrival", value: moment(res.data.arrivalDateTime).format('ddd, MMM DD YYYY, HH:mm') + "-" + res.data.arrivalStationName + "-" + res.data.arrivalCityName },
                    { name: "Passenger Name", value: res.data.passengerName },
                    { name: "Email Booking", value: res.data.emailBooking },
                ],
                sellerPhone: res.data.sellerPhone,
                expiredBefore: res.data.expiredBefore,
                expiredDateTime: moment(res.data.departureDateTime)
            })
        }
    }

    radioValidChange = (event) => {
        var { name } = event.target
        var { validCount, invalidCount, radioName } = this.state;
        this.setState({
            validCount: validCount + 1,
            invalidCount: radioName.indexOf(name) !== -1 ? invalidCount - 1 : invalidCount,
        }, () => {
            this.setState({
                radioName: radioName.indexOf(name) !== -1 ? radioName : radioName + name,
            })
        })
    }

    radioInvalidChange = (event) => {
        var { name } = event.target
        var { validCount, invalidCount, radioName, invalidField } = this.state;
        this.setState({
            invalidCount: invalidCount + 1,
            validCount: radioName.indexOf(name) !== -1 ? validCount - 1 : validCount,
            invalidField: invalidField + ', ' + name
        }, () => {
            this.setState({
                radioName: radioName.indexOf(name) !== -1 ? radioName : radioName + name
            })
        })
    }

    expiredDateTimeChange = (event) => {
        var { value } = event.target;
        this.setState({
            expiredBefore: value,
        })
    }

    commissionPercentChange = (event) => {
        var { value } = event.target;
        this.setState({
            commissionFee: value,
        })
    }

    onConfirm = async () => {
        const ticketId = this.props.match.params.id;
        var { validCount, commissionFee, expiredBefore, expiredDateTime, invalidField } = this.state;

        expiredDateTime.subtract({ hours: expiredBefore })
        expiredDateTime = moment(expiredDateTime._d).format('YYYY-MM-DD HH:mm');
        this.setState({
            isShowConfirmDialog: false
        });
        if (validCount === 8) {
            var res = await Axios.put('api/ticket/approve/' + ticketId + "?commissionFee=" + commissionFee + "&expiredDateTime=" + expiredDateTime);
            if (res.status === 200) {
                toastr.success('Update Success', 'Ticket is valid.');
                this.props.history.push('/newPostedTicket');
            } else {
                toastr.error('Error', 'Error when valid Ticket');
            }
        } else {
            res = await Axios.put('api/ticket/reject/' + ticketId + "?invalidField=" + invalidField.substr(2))
            if (res.status === 200) {
                toastr.success('Update Success', 'Ticket is invalid.');
                this.props.history.push('/newPostedTicket');
            } else {
                toastr.error('Error', 'Error when valid Ticket');
            }
        }
    }

    render() {
        // 
        const {
            ticketDetails,
            validCount,
            invalidCount,
            commissionFee,
            expiredBefore,
            sellerPhone
        } = this.state;
        return (

            <div className="animated fadeIn">
                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                <strong>Valid Ticket</strong>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md="6" xs="12">
                                        <FormGroup>
                                            <Label htmlFor="sellerPhone">Seller Phone</Label>
                                            <Input type="text" id="sellerPhone" disabled value={sellerPhone}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <hr />
                                <Row style={{ marginBottom: 10 }}>
                                    <Col md="6" xs="12"></Col>
                                    <Col md="1"></Col>
                                    <Col md="2" xs="12" style={{ textAlign: 'center' }}>
                                        <h4 style={{ color: '#4DBD74' }}>VALID</h4>
                                    </Col>
                                    <Col md="2" xs="12" style={{ textAlign: 'center' }}>
                                        <h4 style={{ color: '#F86C6B' }}>INVALID</h4>
                                    </Col>
                                </Row>
                                {ticketDetails.map((detail, index) => {
                                    return (<Row key={index}>
                                        <Col md="6" xs="12">
                                            <FormGroup>
                                                <Label htmlFor={detail.name}>{detail.name}</Label>
                                                <Input type="text" id={detail.name} disabled value={detail.value}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="1"></Col>
                                        <Col md="2" xs="12" style={{ textAlign: 'center', marginTop: 35 }}>
                                            <input type="radio"
                                                name={detail.name}
                                                value={true}
                                                onChange={this.radioValidChange} />
                                        </Col>
                                        <Col md="2" xs="12" style={{ textAlign: 'center', marginTop: 35 }}>
                                            <input type="radio"
                                                name={detail.name}
                                                value={false}
                                                onChange={this.radioInvalidChange} />
                                        </Col>
                                    </Row>)
                                })}
                                <hr />
                                <Row style={{ marginBottom: 10, display: validCount !== 8 ? 'none' : 'block' }}>
                                    <Col md="6" xs="12">
                                        <FormGroup>
                                            <Label htmlFor="commissionPercent">Commission Fee (%)</Label>
                                            <Input type="number" name="commissionPercent"
                                                value={commissionFee} min={0}
                                                onChange={this.commissionPercentChange}
                                                disabled={validCount !== 8}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" xs="12">
                                    </Col>
                                </Row>
                                <Row style={{ marginBottom: 10, display: validCount !== 8 ? 'none' : 'block' }}>
                                    <Col md="6" xs="12">
                                        <FormGroup>
                                            <Label htmlFor="expiredDateTime">Expire before departure date (hours)</Label>
                                            <Input type="number" name="expiredDateTime"
                                                value={expiredBefore} min={0}
                                                onChange={this.expiredDateTimeChange}
                                                disabled={validCount !== 8}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" xs="12">
                                    </Col>
                                </Row>
                                <Row className="float-right">
                                    <Col xs="12">
                                        <Button type="button" color="primary" onClick={this.showConfirmDialog} disabled={(validCount + invalidCount) !== 8}>Confirm</Button>
                                        <Button color="secondary" className="ml-1" onClick={() => { this.props.history.push('/newPostedTicket') }}>Cancel</Button>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Modal isOpen={this.state.isShowConfirmDialog} 
                    className="modal-success">
                    <ModalHeader toggle={this.closeConfirmDialog}>Confirm Valid Ticket</ModalHeader>
                    <ModalBody>
                        Do you want to make this ticket become valid ?
                </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={this.onConfirm}>Confirm</Button>
                        <Button color="secondary" onClick={this.closeConfirmDialog}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}