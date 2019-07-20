import Axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { findTicketTypeByIdRequest } from "../../action/TicketTypeAction";

class TicketTypeViewComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ticketType: {
                id: '',
                name: '',
                vehicleId: '',
                vehicleName: '',
            }
        }

        this.handleOnChanged = this.handleOnChanged.bind(this);
        this.onBtnSaveChangesClicked = this.onBtnSaveChangesClicked.bind(this);
        this.onBtnCancleClicked = this.onBtnCancleClicked.bind(this);
    }

    componentWillMount() {
        console.log("thanh");
        var { match } = this.props;
        var transportationID = match.params.id;
        this.props.findTicketTypeById(transportationID);
    }

    componentWillReceiveProps(props) {
        var { ticketType } = props;
        this.setState({
            ticketType: ticketType
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
        } catch(error) {
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
            ticketType: {
                ...this.state.ticketType,
                [id]: value
            },
        });
    }

    async onBtnSaveChangesClicked() {
        let data = this.state.ticketType;

        toastr.info('Processing', 'Wating for update');
        var updateResponse = await Axios.put('api/tickettype', data);
        if(updateResponse.status === 200) {
            toastr.success('Successfully', 'Transportation has been updated.');
            this.props.history.push('/tickettype');
        } else {
            toastr.error('Error', 'Error when update Transportation');
        }
    }

    onBtnCancleClicked() {
        this.props.history.push('/tickettype');
    }

    render() {
        var { ticketType } = this.state;
        var vehicleOption = this.getVehicleOptions();
        
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
                                    <Label htmlFor="name">Name</Label>
                                    <Input type="text" id="name" 
                                        placeholder="Enter Name..."  
                                        value={ticketType.name} 
                                        onChange={this.handleOnChanged}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="vehicleId">Vehicle</Label>
                                    <Input type="select" id="vehicleId" 
                                         value={ticketType.vehicleId}
                                        onChange={this.handleOnChanged}
                                    >
                                        {vehicleOption}
                                    </Input>
                                </FormGroup>
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
        ticketType: state.ticketTypeEdit
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return { 
        findTicketTypeById: (transportationID) => {
            dispatch(findTicketTypeByIdRequest(transportationID));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketTypeViewComponent);

