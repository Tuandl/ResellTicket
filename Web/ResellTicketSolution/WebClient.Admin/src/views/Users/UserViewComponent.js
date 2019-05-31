import Axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { findUserByIdRequest } from "../../action/UserAdminAction";

class UserViewComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {
                id: '',
                userName: '',
                fullName: '',
                email: '',
                phoneNumber: '',
                isActive: 'true',
            },
        }

        this.handleOnChanged = this.handleOnChanged.bind(this);
        this.onBtnSaveChangesClicked = this.onBtnSaveChangesClicked.bind(this);
        this.onBtnCancleClicked = this.onBtnCancleClicked.bind(this);
    }

    componentWillMount() {
        var { match } = this.props;
        var userId = match.params.id;
        this.props.findUserById(userId);
    }

    componentWillReceiveProps(props) {
        var { user } = props;
        this.setState({
            user: user
        })
    }

    componentDidMount() {
        this.getRoles();
    }

    async getRoles() {
        try {
            var roleResponse = await Axios.get('api/role');
            this.setState({
                roles: roleResponse.data.data,
                // user: {
                //     roleId: this.state.user.roleId ?
                //         this.state.user.roleId :
                //         roleResponse.data.data[0].id,
                //     ...this.state.user,
                // }
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

    handleOnChanged(e) {
        const { id, value } = e.target;
        this.setState({
            user: {
                ...this.state.user,
                [id]: value
            },
        });
    }

    async onBtnSaveChangesClicked() {
        let data = this.state.user;
        if(data.roleId === null) {
            data.roleId = this.state.roles[0].id;
        }
        toastr.info('Infomation', 'Please wait while we processing your request.');
        var updateResponse = await Axios.put('api/user', data);
        if(updateResponse.status === 200) {
            toastr.success('Update Success', 'User has been updated successfully.');
            this.props.history.push('/user');
        } else {
            toastr.error('Error', 'Error when update User');
        }
    }

    onBtnCancleClicked() {
        this.props.history.push('/user');
    }

    render() {
        var { user } = this.state;

        var roleOptions = this.getRoleOptions();

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
                                        placeholder="Enter Username..." disabled 
                                        value={user.userName} 
                                        onChange={this.handleOnChanged}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input type="text" id="fullName" 
                                        placeholder="Enter Full Name..." disabled 
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
                                        placeholder="Enter email..." disabled 
                                        value={user.email} 
                                        onChange={this.handleOnChanged}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <Input type="text" id="phoneNumber" 
                                        placeholder="Enter Phone number..." disabled 
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
        user: state.userEdit
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        findUserById: (userId) => {
            dispatch(findUserByIdRequest(userId));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserViewComponent);

