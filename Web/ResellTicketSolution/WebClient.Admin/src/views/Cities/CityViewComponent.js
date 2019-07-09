import Axios from 'axios';
import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Input, Label, Row, FormGroup } from 'reactstrap';

class CityViewComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            city: {
                id: '',
                name: '',
                timeZoneId: '',
            },
            timeZoneOptions: [],
        };

        this.getTimeZoneOptions = this.getTimeZoneOptions.bind(this);
    }

    componentWillMount() {
        this.getTimeZoneOptions();
    }

    getCityById = (id) => {
        Axios.get(`api/city/${id}`).then(res => {
            this.setState({
                city: res.data
            })
        })
    }

    async getTimeZoneOptions() {
        var response = await Axios.get(`api/timezone`)
        this.setState({
            timeZoneOptions: response.data,
        });

        var { match } = this.props;
        this.getCityById(match.params.id);
    }

    handleOnChanged = (event) => {
        const { id, value } = event.target;
        this.setState({
            city: {
                ...this.state.city,
                [id]: value
            }
        })
    }

    onSaveChanges = () => {
        var { city } = this.state;
        Axios.put('api/city/', city).then(res => {
            if (res.status === 200) {
                toastr.success('Update Success', 'City has been updated successfully.');
                this.props.history.push('/city');
            } else {
                toastr.error('Error', 'Error when update City');
            }
        })
    }

    renderTimeZoneOptions(timeZoneOptions) {
        return (
            timeZoneOptions.map(option => {
                return (
                    <option key={option.value} value={option.value}>{option.text}</option>
                );
            })
        );
    }

    render() {
        var { city, timeZoneOptions } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <strong><i className="icon-info pr-1"></i>City Details</strong>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="name">City Name</Label>
                                    <Input type="text" id="name"
                                        placeholder="Enter City Name..."
                                        value={city.name}
                                        onChange={this.handleOnChanged}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="timeZoneId">Time Zone</Label>
                                    <Input type="select" name="timeZoneId" id="timeZoneId"
                                        value={city.timeZoneId}
                                        onChange={this.handleOnChanged}>
                                        {this.renderTimeZoneOptions(timeZoneOptions)}
                                    </Input>
                                </FormGroup>
                            </Col> 
                        </Row>
                        
                        <Row className="float-right">
                            <Col xs="12">
                                <Button type="button" color="primary" onClick={this.onSaveChanges}>Save changes</Button>
                                <Link to='/city'>
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

export default CityViewComponent;
