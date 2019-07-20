
import Axios from 'axios';
import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Input, Label, Row, FormGroup } from 'reactstrap';

class StationViewComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            station: {
                id: '',
                name: '',
                cityId: '',
                cityName: ''
            }
        }
        // debugger;
    }

    componentWillMount() {
        var { match } = this.props;
        //console.log(match.params.id);
        this.getStationById(match.params.id);
    }

    getStationById = (id) => {
        Axios.get(`api/station/${id}`).then(res => {
            this.setState({
                station: res.data
            })
        })
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
        this.setState({
            station: {
                ...this.state.station,
                [id]: value
            }
        })
    }

    onSaveChanges = () => {
        toastr.info('Processing', 'Wating for update');
        var { station } = this.state;
        console.log("123", station);
        Axios.put('api/station/', station).then(res => {
            if (res.status === 200) {
                toastr.success('Successfully', 'Station has been updated.');
                this.props.history.push('/station');
            } else {
                toastr.error('Error', 'Error when update Station');
            }
        })
    }

    render() {
        var { station } = this.state;
        var cityOptions = this.getCityOptions();
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <strong><i className="icon-info pr-1"></i>Station Details</strong>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md="6" xs="12">
                                <Label htmlFor="stationame">Stationname</Label>
                                <Input type="text" id="name"
                                    placeholder="Enter Stationname..."
                                    value={station.name}
                                    onChange={this.handleOnChanged}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6" xs="12">
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

export default StationViewComponent;
