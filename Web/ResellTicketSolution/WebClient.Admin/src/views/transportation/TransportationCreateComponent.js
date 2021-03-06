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
                vehicleId: '',
                expiredBefore: 0
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
        toastr.info('Processing', 'Wating for create');
        var { nameError, phoneError, emailError } = this.state
        if (nameError === '' && phoneError === '' && emailError === '') {
            let data = this.state.transportation;
            //toastr.info('Infomation', 'Please wait while we processing your request.');
            var updateResponse = await Axios.post('api/transportation', data);
            if (updateResponse.status === 200) {
                toastr.success('Successfully', 'Transportstion has been created.');
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
                        <strong><i className="icon-info pr-1"></i>Create Transportstion</strong>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="name">Name <span style={{ color: 'red'}}>*</span></Label>
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
                                    <Label htmlFor="email">Email <span style={{ color: 'red' }}>*</span></Label>
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
                                    <Label htmlFor="phoneNumber">Phone <span style={{ color: 'red' }}>*</span></Label>
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
                                    <Label htmlFor="vehicleId">Vehicle <span style={{ color: 'red', float: 'right' }}>*</span></Label>
                                    <Input type="select" id="vehicleId"
                                        value={transportation.vehicleId}
                                        onChange={this.handleOnChanged}
                                    >
                                        {getVehicleOptions}
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="expiredBefore">Expire before departure date</Label>
                                    <Input type="number" min={0} id="expiredBefore"
                                        placeholder="Enter hours..."
                                        value={transportation.expiredBefore}
                                        onChange={this.handleOnChanged}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6" xs="12">
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