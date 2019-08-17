import Axios from 'axios';
import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Label, Input, Row } from 'reactstrap';
import moment from 'moment';

export default class TicketDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ticketDetail: {
                sellerPhone:'',
                ticketCode: '',
                vehicle: '',
                transportation: '',
                ticketType: '',
                departure: '',
                arrival: '',
                expiredDateTime:'',
                sellingPrice: '',
            }
        }
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
                    sellerName: res.data.sellerName,
                    ticketCode: res.data.ticketCode,
                    vehicle: res.data.vehicleName,
                    transportationName: res.data.transportationName,
                    transportationPhone: res.data.transportationPhone,
                    ticketType: res.data.ticketTypeName,
                    departure: moment(res.data.departureDateTime).format('ddd, MMM DD YYYY, HH:mm') + "-" + res.data.departureStationName + "-" + res.data.departureCityName,
                    arrival: moment(res.data.arrivalDateTime).format('ddd, MMM DD YYYY, HH:mm') + "-" + res.data.arrivalStationName + "-" + res.data.arrivalCityName,
                    expiredDateTime: moment(res.data.expiredDateTime).format('ddd, MMM DD YYYY, HH:mm'),
                    sellingPrice: '$' + res.data.sellingPrice,
                }
            })
        }
    }

    goBack = () => {
        this.props.history.goBack();
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
                                            <Label htmlFor="sellerName">Seller's Fullname</Label>
                                            <Input type="text" disabled value={ticketDetail.sellerName}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" xs="12">
                                        <FormGroup>
                                            <Label htmlFor="sellerPhone">Seller's Phone</Label>
                                            <Input type="text" disabled value={ticketDetail.sellerPhone}
                                            />
                                        </FormGroup>
                                    </Col>
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
                                            <Input type="text" disabled value={ticketDetail.transportationName}
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
                                        <Button color="secondary" className="ml-1" onClick={() => this.goBack()}>Back</Button>
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