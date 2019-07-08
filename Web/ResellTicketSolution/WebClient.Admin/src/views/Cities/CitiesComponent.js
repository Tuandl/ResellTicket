import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Form, Input, InputGroup, Row, Table } from 'reactstrap';
import Axios from 'axios';

function CityRow(props) {
    const city = props.city
    const cityLink = `/city/${city.id}`

    return (
        <tr>
            <th>{props.index + 1}</th>
            <td>{city.name}</td>
            <td>{city.timeZoneId}</td>
            <td>
                <Link to={cityLink}>
                    <Button color="danger" className="mr-2">
                        <i className="fa fa-edit fa-lg mr-1"></i>Edit
                    </Button>
                </Link>
            </td>
        </tr>


    )
}

class CitiesComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: [],
            isLogin: false,
            userRole: '',
            searchParam: '',
        }
        this.onSearch = this.onSearch.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentWillMount() {
        var token = localStorage.getItem('userToken');
        if (token) {
            this.setState({
                isLogin: true
            })
            var jwt = require('jwt-decode');
            var decode = jwt(token);
            var userRole = decode['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            if (userRole === 'Manager') {
                this.getCities();
                this.setState({
                    userRole: userRole
                })
            }
        }

    }

    getCities = () => {
        Axios.get('api/city').then(res => {
            this.setState({
                cities: res.data
            })
        })
    }

    onChange(event) {
        var { name, value } = event.target;
        this.setState({
            [name]: value
        })
    }

    onSearch(event) {
        event.preventDefault();
        //console.log(this.state.searchParam);
        Axios.get('api/city?param=' + this.state.searchParam).then(res => {
            console.log(res)
            this.setState({
                cities: res.data
            })
        });
    }

    render() {
        var { cities } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                <Link to='/city/add'>
                                    <Button className="text-right" color="primary">
                                        <i className="fa fa-plus fa-lg mr-1"></i>Create City
                                    </Button>
                                </Link>
                                <Form className="text-right mr-2" onSubmit={this.onSearch}>
                                    <InputGroup>
                                        <Input type="text" className="mr-2" placeholder="Cityname"
                                            value={this.state.searchParam} name="searchParam" onChange={this.onChange} />
                                        <Button color="primary">
                                            <i className="fa fa-search fa-lg mr-1"></i>Search City
                                      </Button>
                                    </InputGroup>
                                </Form>
                            </CardHeader>
                            <CardBody>
                                <Table responsive hover>
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Name</th>
                                            <th>Time Zone</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cities.map((city, index) =>
                                            <CityRow key={index} city={city} index={index} />
                                        )}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default CitiesComponent;
