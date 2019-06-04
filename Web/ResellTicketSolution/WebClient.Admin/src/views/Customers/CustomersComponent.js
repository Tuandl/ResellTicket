import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Badge, Button, Card, CardBody, CardHeader, Col, Form, Input, InputGroup, Row, Table } from 'reactstrap';
import Axios from 'axios';

function CustomerRow(props) {
    const customer = props.customer
    const customerLink = `/customer/${customer.id}`

    const getBadge = (isActive) => {
        if (isActive === true) {
            return (
                <Badge color="success">Active</Badge>
            )
        } else {
            return (
                <Badge color="danger">Inactive</Badge>
            )
        }
    }

    return (
        <tr>
            <th>{props.index + 1}</th>
            <td>{customer.username}</td>
            <td>{customer.fullName}</td>
            <td>{customer.email}</td>
            <td>{customer.phoneNumber}</td>
            <td>{getBadge(customer.isActive)}</td>
            <td>
                <Link to={customerLink}>
                    <Button color="danger" className="mr-2">
                        <i className="fa fa-edit fa-lg mr-1"></i>Edit
                    </Button>
                </Link>
            </td>
        </tr>


    )
}

class CustomersComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            isLogin: false,
            userRole: '', 
            searchParam : '',
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
                this.getCustomers();
                this.setState({
                    userRole: userRole
                })
            }
        }

    }

    getCustomers = async () => {
        await Axios.get('api/customer').then(res => {
            this.setState({
                customers: res.data
            })
        })
    }

    onChange(event) {
        var {name, value} = event.target;
        this.setState({
            [name] : value
        })
    }

    async onSearch(event) {
        event.preventDefault();
        //console.log(this.state.searchParam);
        await Axios.get('api/customer?param=' + this.state.searchParam).then(res => {
            console.log(res)
            this.setState({
                customers : res.data
            })
        });
    }

    render() {
        var { customers } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                <Form className="text-right mr-2" onSubmit={this.onSearch}>
                                    <InputGroup>
                                        <Input type="text" className="mr-2" placeholder="Username or Fullname"
                                        value={this.state.searchParam} name="searchParam" onChange={this.onChange}/>
                                        <Button color="primary">
                                            <i className="fa fa-search fa-lg mr-1"></i>Search Customer
                                        </Button>
                                    </InputGroup>
                                </Form>
                            </CardHeader>
                            <CardBody>
                                <Table responsive hover>
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Username</th>
                                            <th>Fullname</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customers.map((customer, index) =>
                                            <CustomerRow key={index} customer={customer} index={index} />
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

export default CustomersComponent;