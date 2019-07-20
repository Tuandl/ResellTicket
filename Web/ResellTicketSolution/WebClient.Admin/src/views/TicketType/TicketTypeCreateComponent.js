import Axios from 'axios';
import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row } from 'reactstrap';


class TicketTypeCreateComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ticketType: {
                name: '',
                vehicleId: ''
            },
            nameError: '',
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
                ticketType: {
                    ...this.state.ticketType,
                    vehicleId: vehicleResponse.data[0].id,
                },
            });
        } catch (error) {
            toastr.error('Error', 'Error on Load Vehicle Data');
        }
    }

    handleOnChanged = (event) => {
        const { id, value } = event.target;
        if (id === 'name') {
            this.setState({
                nameError: '',
            })
        } 
        this.setState({
            ticketType: {
                ...this.state.ticketType,
                [id]: value
            },
        });
    }

    onBtnCancleClicked() {
        this.props.history.push('/tickettype');
    }

    async onBtnCreateClicked() {
        toastr.info('Processing', 'Wating for create');
        var { nameError } = this.state;
        if (nameError === '') {
            let data = this.state.ticketType;
            //toastr.info('Infomation', 'Please wait while we processing your request.');
            var updateResponse = await Axios.post('api/tickettype', data);
            if (updateResponse.status === 200) {
                toastr.success('Successfully', 'Ticket Type has been created.');
                this.props.history.push('/tickettype');
            } else {
                toastr.error('Error', 'Error when create Ticket Type');
            }
        }

    }

    render() {

        const { ticketType } = this.state;

        const getVehicleOptions = this.getVehicleOptions();

        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <strong><i className="icon-info pr-1"></i>Ticket Type Detail</strong>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="name">Name <span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="text" id="name"
                                        placeholder="Enter name..."
                                        value={ticketType.name}
                                        onChange={this.handleOnChanged}
                                        required
                                    />
                                    <div style={{ color: 'red', float: 'right' }}>{this.state.nameError}</div>
                                </FormGroup>
                            </Col>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="vehicleId">Vehicle <span style={{ color: 'red', float: 'right' }}> *</span></Label>
                                    <Input type="select" id="vehicleId"
                                        value={ticketType.vehicleId}
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

export default TicketTypeCreateComponent;