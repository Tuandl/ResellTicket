import Axios from 'axios';
import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import {Link} from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row } from 'reactstrap';

class CustomerViewComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customer: {
                id: '',
                username: '',
                fullName: '',
                email: '',
                phoneNumber: '',
                isActive: 'true',
            }
        }
    }

    componentWillMount() {
        var {match} = this.props;
        //console.log(match.params.id);
        this.getCustomerById(match.params.id);
    }

    getCustomerById = async (id) => {
        await Axios.get(`api/customer/${id}`).then(res => {
            this.setState({
                customer : res.data
            })
        })
    }

    handleOnChanged = (event) => {
        const {id, value} = event.target;
        this.setState({
            customer : {
                ...this.state.customer,
                [id] : value
            }
        })
    }

    onSaveChanges = async () => {
        toastr.info('Processing', 'Waiting for update');
        var {customer} = this.state;
        await Axios.put('api/customer/', customer).then(res => {
            if(res.status === 200) {
                toastr.success('Successfully', 'Customer has been updated.');
                this.props.history.push('/customer');
            } else {
                toastr.error('Error', 'Error when update Customer');
            }
        })
    }

    render() {
        var { customer } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <strong><i className="icon-info pr-1"></i>Customer Details</strong>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="userName">Username</Label>
                                    <Input type="text" id="userName" 
                                        placeholder="Enter Username..." disabled 
                                        value={customer.username} 
                                        onChange={this.handleOnChanged}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input type="text" id="fullName" 
                                        placeholder="Enter Full Name..." disabled 
                                        value={customer.fullName} 
                                        onChange={this.handleOnChanged}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="email">Email</Label>
                                    <Input type="email" id="email" 
                                        placeholder="Enter email..." disabled 
                                        value={customer.email} 
                                        onChange={this.handleOnChanged}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <Input type="text" id="phoneNumber" 
                                        placeholder="Enter Phone number..." disabled 
                                        value={customer.phoneNumber} 
                                        onChange={this.handleOnChanged}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="isActive">Status</Label>
                                    <Input type="select" id="isActive" 
                                        value={customer.isActive} 
                                        onChange={this.handleOnChanged}
                                    >
                                        <option value={true}>Active</option>
                                        <option value={false}>Inactive</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="float-right">
                            <Col xs="12">
                                <Button type="button" color="primary" onClick={this.onSaveChanges}>Save changes</Button>
                                <Link to='/customer'>
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

export default CustomerViewComponent;
