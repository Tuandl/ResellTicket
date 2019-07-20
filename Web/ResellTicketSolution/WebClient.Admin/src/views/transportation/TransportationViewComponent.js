import Axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { findTransportationByIdRequest } from "../../action/UserAdminAction";

class TransportationViewComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            transportation: {
                id: '',
                name: '',
                phoneNumber: '',
                email: '',
                vehicleId: '',
                vehicleName: '',
                expiredBefore: 0
            }
        }

        this.handleOnChanged = this.handleOnChanged.bind(this);
        this.onBtnSaveChangesClicked = this.onBtnSaveChangesClicked.bind(this);
        this.onBtnCancleClicked = this.onBtnCancleClicked.bind(this);
    }

    componentWillMount() {
        var { match } = this.props;
        var transportationID = match.params.id;
        this.props.findTransportationById(transportationID);
    }

    componentWillReceiveProps(props) {
        var { transportation } = props;
        this.setState({
            transportation: transportation
        });
        this.getVehicle();
    }

    componentDidMount() {
        this.getVehicle();
    }

    async getVehicle() {
        try {
            var vehicleResponse = await Axios.get('api/vehicle');
            this.setState({
                vehicles: vehicleResponse.data,
            });
        } catch (error) {
            toastr.error('Error', 'Error on Load Roles Data');
        }
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


    handleOnChanged(e) {
        const { id, value } = e.target;
        this.setState({
            transportation: {
                ...this.state.transportation,
                [id]: value
            },
        });
    }

    async onBtnSaveChangesClicked() {
        let data = this.state.transportation;

        toastr.info('Processing', 'Wating for update');
        var updateResponse = await Axios.put('api/transportation', data);
        if (updateResponse.status === 200) {
            toastr.success('Successfully', 'Transportation has been updated.');
            this.props.history.push('/transportation');
        } else {
            toastr.error('Error', 'Error when update Transportation');
        }
    }

    onBtnCancleClicked() {
        this.props.history.push('/transportation');
    }

    render() {
        var { transportation } = this.state;
        var vehicleOption = this.getVehicleOptions();

        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <strong><i className="icon-info pr-1"></i>Transportation Detail</strong>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="name">Name</Label>
                                    <Input type="text" id="name"
                                        placeholder="Enter Name..."
                                        value={transportation.name}
                                        onChange={this.handleOnChanged}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="email">Email</Label>
                                    <Input type="email" id="email"
                                        placeholder="Enter email..."
                                        value={transportation.email}
                                        onChange={this.handleOnChanged}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <Input type="text" id="phoneNumber"
                                        placeholder="Enter Phone number..."
                                        value={transportation.phoneNumber}
                                        onChange={this.handleOnChanged}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="vehicleId">Vehicle</Label>
                                    <Input type="select" id="vehicleId"
                                        value={transportation.vehicleId}
                                        onChange={this.handleOnChanged}
                                    >
                                        {vehicleOption}
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
                                <Button type="button" color="primary" onClick={this.onBtnSaveChangesClicked}>Save changes</Button>
                                <Button color="secondary" className="ml-1" onClick={this.onBtnCancleClicked}>Cancel</Button>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        transportation: state.transportationEdit
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        findTransportationById: (transportationID) => {
            dispatch(findTransportationByIdRequest(transportationID));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransportationViewComponent);

