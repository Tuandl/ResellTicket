import Axios from 'axios';
import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row } from 'reactstrap';


class TransportationCreateComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            transportation: {
                name: '',
                phoneNumber: '',
                email: '',
                vehicleId: ''
            },
            nameError: '',
            emailError: '',
            phoneError: ''
        };

        this.handleOnChanged = this.handleOnChanged.bind(this);
        this.onBtnCreateClicked = this.onBtnCreateClicked.bind(this);
        this.onBtnCancleClicked = this.onBtnCancleClicked.bind(this);
    }

    componentDidMount() {
        this.getVehicle();
    }

    getVehicleOptions() {
        if (this.state.vehicles) {
            return this.state.vehicles.map((vehicle, index) => {
                return (
                    <option key={index} value={vehicle.id}>{vehicle.name}</option>
                );
            });
        } else {
            return [];
        }
    }

    async getVehicle() {
        try {
            var vehicleResponse = await Axios.get('api/vehicle');
            this.setState({
                vehicles: vehicleResponse.data,
                transportation: {
                    ...this.state.transportation,
                    vehicleId: vehicleResponse.data[0].id,
                },
            });
        } catch (error) {
            toastr.error('Error', 'Error on Load Vehicle Data');
        }
    }

    handleOnChanged = (event) => {
        const { id, value } = event.target;
        if (id === 'phoneNumber') {
            var regex = '[0-9]{8,11}';
            if (!value.match(regex)) {
                this.setState({
                    phoneError: 'Phone required 8 - 11 digit numbers',
                })
            } else {
                this.setState({
                    phoneError: '',
                })
            }
        } else if (id === 'name') {
            this.setState({
                nameError: '',
            })
        } else if (id === 'email') {
            this.setState({
                emailError: '',
            })
        }
        this.setState({
            transportation: {
                ...this.state.transportation,
                [id]: value
            },
        });
    }

    onBtnCancleClicked() {
        this.props.history.push('/transportation');
    }

    async onBtnCreateClicked() {
        var { nameError, phoneError, emailError } = this.state
        if (nameError === '' && phoneError === '' && emailError === '') {
            let data = this.state.transportation;
            console.log("thanh1234", data);
            toastr.info('Infomation', 'Please wait while we processing your request.');
            var updateResponse = await Axios.post('api/transportation', data);
            console.log("thanh123", updateResponse);
            if (updateResponse.status === 200) {
                toastr.success('Create Success', 'Transportstion has been created successfully.');
                this.props.history.push('/transportation');
            } else {
                toastr.error('Error', 'Error when create Transportstion');
            }
        }

    }

    render() {

        const { transportation } = this.state;

        const getVehicleOptions = this.getVehicleOptions();

        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <strong><i className="icon-info pr-1"></i>Transportstion Detail</strong>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="name">Name &nbsp;</Label><span style={{ color: 'red', float: 'right' }}>*</span>
                                    <Input type="text" id="name"
                                        placeholder="Enter name..."
                                        value={transportation.name}
                                        onChange={this.handleOnChanged}
                                        required
                                    />
                                    <div style={{ color: 'red', float: 'right' }}>{this.state.nameError}</div>
                                </FormGroup>
                            </Col>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="email">&nbsp;</Label><span style={{ color: 'red', float: 'right' }}>*</span>
                                    <Input type="email" id="email"
                                        placeholder="Enter email..."
                                        value={transportation.email}
                                        onChange={this.handleOnChanged}
                                        required
                                    />
                                    <div style={{ color: 'red', float: 'right' }}>{this.state.emailError}</div>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="phoneNumber">Phone &nbsp;</Label><span style={{ color: 'red', float: 'right' }}>*</span>
                                    <Input type="text" id="phoneNumber"
                                        placeholder="Enter Phone number..."
                                        value={transportation.phoneNumber}
                                        onChange={this.handleOnChanged}
                                        required
                                    />
                                    <div style={{ color: 'red', float: 'right' }}>{this.state.phoneError}</div>
                                </FormGroup>
                            </Col>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="vehicleId">&nbsp;</Label><span style={{ color: 'red', float: 'right' }}>*</span>
                                    <Input type="select" id="vehicleId"
                                        value={transportation.vehicleId}
                                        onChange={this.handleOnChanged}
                                    >
                                        {getVehicleOptions}
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="float-right">
                            <Col xs="12">
                                <Button type="button" color="primary" onClick={this.onBtnCreateClicked}>Save changes</Button>
                                <Button color="secondary" className="ml-1" onClick={this.onBtnCancleClicked}>Cancel</Button>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default TransportationCreateComponent;