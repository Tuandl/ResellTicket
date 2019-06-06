import Axios from 'axios';
import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row } from 'reactstrap';

class UserCreateComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                userName: '',
                password: '',
                email: '',
                phoneNumber: '',
                fullName: '',
                isActive: 'true',
            },
            roles: [],
        };

        this.handleOnChanged = this.handleOnChanged.bind(this);
        this.onBtnCreateClicked = this.onBtnCreateClicked.bind(this);
        this.onBtnCancleClicked = this.onBtnCancleClicked.bind(this);
    }

    componentDidMount() {
        this.getRoles();
    }

    async getRoles() {
        try {
            var roleResponse = await Axios.get('api/role');
            this.setState({
                roles: roleResponse.data.data,
                user: {
                    ...this.state.user,
                    roleId: roleResponse.data.data[0].id,
                },
            });
        } catch(error) {
            toastr.error('Error', 'Error on Load Roles Data');
        }
    }

    getRoleOptions() {
        if (this.state.roles) {
            return this.state.roles.map((role, index) => {
                return (
                    <option key={index} value={role.id}>{role.name}</option>
                );
            });
        } else {
            return [];
        }
    }

    handleOnChanged = (event) => {
        const { id, value } = event.target;
        this.setState({
            user: {
                ...this.state.user,
                [id]: value
            },
        });
    }

    onBtnCancleClicked() {
        this.props.history.push('/user');
    }

    async onBtnCreateClicked() {
        let data = this.state.user;

        toastr.info('Infomation', 'Please wait while we processing your request.');
        var updateResponse = await Axios.post('api/user', data);
        if(updateResponse.status === 200) {
            toastr.success('Create Success', 'User has been created successfully.');
            this.props.history.push('/user');
        } else {
            toastr.error('Error', 'Error when create User');
        }
    }

    render() {

        const { user } = this.state;

        const roleOptions = this.getRoleOptions();

        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <strong><i className="icon-info pr-1"></i>User Detail</strong>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="userName">Username</Label>
                                    <Input type="text" id="userName"
                                        placeholder="Enter Username..."
                                        value={user.userName}
                                        onChange={this.handleOnChanged}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input type="text" id="fullName"
                                        placeholder="Enter Full Name..."
                                        value={user.fullName}
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
                                        placeholder="Enter email..."
                                        value={user.email}
                                        onChange={this.handleOnChanged}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <Input type="text" id="phoneNumber"
                                        placeholder="Enter Phone number..."
                                        value={user.phoneNumber}
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
                                        value={user.isActive}
                                        onChange={this.handleOnChanged}
                                    >
                                        <option value={true}>Active</option>
                                        <option value={false}>Inactive</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="roleId">Role</Label>
                                    <Input type="select" id="roleId"
                                        value={user.roleId}
                                        onChange={this.handleOnChanged}
                                    >
                                        {roleOptions}
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

export default UserCreateComponent;
