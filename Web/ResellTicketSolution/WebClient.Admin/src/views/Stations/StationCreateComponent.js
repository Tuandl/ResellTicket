import Axios from 'axios';
import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, FormGroup, Col, Input, Label, Row } from 'reactstrap';

class StationCreateComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            station: {
                name: '',
                cityId: '',
                cityName: ''
            },
            stationNameError: '*'
        }
        // debugger
    }

    componentDidMount() {
        this.getCities();
    }

    async getCities() {
        try {
            var cityResponse = await Axios.get('api/city');
            // console.log("123",cityResponse);
            this.setState({
                cities: cityResponse.data.data,
                station: {
                    ...this.state.station,
                    cityId: cityResponse.data.data[0].id,
                }
            });
        } catch (error) {
            toastr.error('Error', 'Error on Load Cities Data');
        }
    }

    getCityOptions() {
        if (this.state.cities) {
            return this.state.cities.map((city, index) => {
                return (
                    <option key={index} value={city.id}>{city.name}</option>
                );
            });
        } else {
            return [];
        }
    }

    handleOnChanged = (event) => {
        const { id, value } = event.target;
        if (id === 'name') {
            this.setState({
                stationNameError: '',
            })
        }
        this.setState({
            station: {
                ...this.state.station,
                [id]: value
            }
        });
    }

    onSaveChanges = () => {

        var { stationNameError } = this.state;
        if (stationNameError === '') {
            var { station } = this.state;
            Axios.post('api/station/', station).then(res => {
                if (res.status === 200) {
                    toastr.success('Create Success', 'Station has been created successfully.');
                    this.props.history.push('/station');
                } else {
                    toastr.error('Error', 'Error when create Station');
                }
            })
        }
    }

    render() {
        var { station } = this.state;
        var cityOptions = this.getCityOptions();
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <strong><i className="icon-info pr-1"></i>Create Station</strong>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md="3" xs="12">
                                <FormGroup>
                                    <Label htmlFor="stationName">Stationname&nbsp;<span style={{ color: 'red', float: 'right' }}>{this.state.stationNameError}</span></Label>
                                    <Input type="text" id="name"
                                        placeholder="Enter Stationname..."
                                        value={station.name}
                                        onChange={this.handleOnChanged}
                                    />

                                </FormGroup>
                            </Col>

                        </Row>
                        <Row>
                            <Col md="2" xs="12">
                                <FormGroup>
                                    <Label htmlFor="cityId">Cityname</Label>
                                    <Input type="select" id="cityId"
                                        value={station.cityId}
                                        onChange={this.handleOnChanged}
                                    >

                                        {cityOptions}
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="float-right">
                            <Col xs="12">
                                <Button type="button" color="primary" onClick={this.onSaveChanges}>Save changes</Button>
                                <Link to='/station'>
                                    <Button color="secondary" className="ml-1">Cancel</Button>
                                </Link>

                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
        )
    }

}

export default StationCreateComponent;
