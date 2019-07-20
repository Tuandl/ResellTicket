import Axios from 'axios';
import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row } from 'reactstrap';
// import { tsImportEqualsDeclaration } from '@babel/types';

class UserProfileComponent extends Component {
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
            display: 'none',
            currentPass : '',
            newPass : '',
            confirmPass : ''
        }

        this.getUserProfile = this.getUserProfile.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSaveChanges = this.onSaveChanges.bind(this);
        this.onCancleUpdateProfile = this.onCancleUpdateProfile.bind(this);

        this.onShowForm = this.onShowForm.bind(this);
        this.onCancleChangePass = this.onCancleChangePass.bind(this);
        this.onChangePass = this.onChangePass.bind(this);
        this.onSaveChangePass = this.onSaveChangePass.bind(this);
    }

    componentWillMount() {
        var token = localStorage.getItem('userToken');
        var jwt = require('jwt-decode');
        var decode = jwt(token);
        var userId = decode['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
        this.getUserProfile(userId);

    }

    //get user profile không cần decode, token gửi lên backend có thể lấy username ra
    async getUserProfile(id) {
        await Axios.get(`/api/user/${id}`).then(res => {
            this.setState({
                user: res.data
            })
        })
    }

    async onSaveChanges() {
        toastr.info('Processing', 'Waiting for update.');
        await Axios.put('api/user/profile', this.state.user).then(res => {
            if (res.status === 200) {
                toastr.success('Successfully', 'Your profile has been updated.');
                // this.props.history.push('/user');
            } else {
                toastr.error('Error', 'Error when update User');
            }
        })
    }

    onChange(event) {
        var { id, value } = event.target
        this.setState({
            user: {
                ...this.state.user,
                [id]: value
            }
        })
    }

    onChangePass(event) {
        var { id, value } = event.target
        this.setState({
            [id] : value
        })
    }

    onCancleUpdateProfile() {
        this.props.history.goback();
    }

    onCancleChangePass() {
        this.setState({
            display: 'none',
            currentPass : '',
            newPass : '',
            confirmPass : ''
        })
    }

    onShowForm() {
        this.setState({
            display: ''
        })
    }

    onSaveChangePass() {
        
        if(this.state.newPass !== this.state.confirmPass) {
            toastr.error('Change Fail', 'New Password and Confirm Password are not match');
        } else {
            var userChangePass = {
                userName : this.state.user.userName,
                currentPass : this.state.currentPass,
                newPass : this.state.confirmPass
            }

            toastr.info('Processing', 'Waiting for change password');
            Axios.put('api/user/password', userChangePass).then(res => {
                if(res.status === 200) {
                    toastr.success('Successfully', 'Your password has been changed.');
                }else if(res.response.status === 406) {
                    toastr.error('Change Fail', res.response.data);
                }
            })
        }

    }

    render() {
        var { user } = this.state
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <strong><i className="icon-info pr-1"></i>User Profile</strong>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="userName">Username</Label>
                                    <Input type="text" id="userName"
                                        placeholder="Enter Username..." disabled
                                        value={user.userName}
                                        onChange={this.onChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input type="text" id="fullName"
                                        placeholder="Enter Full Name..."
                                        value={user.fullName}
                                        onChange={this.onChange}
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
                                        onChange={this.onChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <Input type="text" id="phoneNumber"
                                        placeholder="Enter Phone number..."
                                        value={user.phoneNumber}
                                        onChange={this.onChange}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="float-right">
                            <Col xs="12">
                                <Button type="button" color="primary" onClick={this.onShowForm}>Change Password</Button>
                                <Button type="button" color="primary" className="ml-1" onClick={this.onSaveChanges}>Save changes</Button>
                                <Button color="secondary" className="ml-1" onClick={this.onCancleUpdateProfile}>Cancel</Button>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <br />
                <Card style={{ display: this.state.display }}>
                    <CardHeader>
                        <strong><i className="icon-info pr-1"></i>Change Password</strong>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="currentPass">Current Password</Label>
                                    <Input type="password" id="currentPass"
                                        placeholder="Enter current password..."
                                     value={this.state.currentPass}
                                     onChange={this.onChangePass}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6" xs="12"></Col>
                        </Row>
                        <Row>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="newPass">New Password</Label>
                                    <Input type="password" id="newPass"
                                        placeholder="Enter new password..."
                                     value={this.state.newPass}
                                     onChange={this.onChangePass}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6" xs="12"></Col>
                        </Row>
                        <Row>
                            <Col md="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="confirmPass">Confirm Password</Label>
                                    <Input type="password" id="confirmPass"
                                        placeholder="Confirm password..."
                                     value={this.state.confirmPass}
                                     onChange={this.onChangePass}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6" xs="12"></Col>
                        </Row>
                        <Row className="float-right">
                            <Col xs="12">
                                <Button type="button" color="primary" className="ml-1" onClick={this.onSaveChangePass}>Save changes</Button>
                                <Button color="secondary" className="ml-1" onClick={this.onCancleChangePass}>Cancel</Button>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default UserProfileComponent;
