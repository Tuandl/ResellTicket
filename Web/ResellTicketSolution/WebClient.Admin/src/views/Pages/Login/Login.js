import Axios from 'axios';
import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Redirect } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txtUsername: '',
            txtPassword: '',
            isRedirect: false,
            userRole: '',
            deviceId: ''
        };
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.login();
    }

    login = async () => {
        let data = {
            username: this.state.txtUsername,
            password: this.state.txtPassword,
            deviceId: this.state.deviceId
        };
        try {
            let loginResponse = await Axios.post('api/token/checklogin', data);
            if (loginResponse.status === 200) {
                localStorage.setItem('userToken', loginResponse.data);
                Axios.defaults.headers.common['Authorization'] = `bearer ${loginResponse.data}`;
                var jwt = require('jwt-decode');
                var decode = jwt(loginResponse.data);
                this.setState({
                    isRedirect: true,
                    userRole: decode['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
                });

            } else {
                toastr.error('Login Failed', 'Incorrect Username or Password!');
            }
        } catch (ex) {
            toastr.error('Login Failed', 'Incorrect Username or Password!');
        }
    }

    async componentWillMount() {
        const self = this;
        var OneSignal = window.OneSignal || [];
        await OneSignal.getUserId(function (userId) {
            self.setState({
                deviceId: userId
            })
        });
        var token = localStorage.getItem('userToken');
        if (token !== null && token !== '') {
            var jwt = require('jwt-decode');
            var decode = jwt(token);
            this.setState({
                isRedirect: true,
                userRole: decode['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
            });
        }
    }

    render() {
        if (this.state.isRedirect && this.state.userRole === 'Manager') {
            return <Redirect to="/dashboard" />
        } else if (this.state.isRedirect && this.state.userRole === 'Staff') {
            return <Redirect to="/newPostedTicket" />
        }

        const { txtUsername, txtPassword } = this.state;

        return (
            <div className="app flex-row align-items-center">
                <Container>
                    <Row className="justify-content-center">
                        <Col md="6">
                            <CardGroup>
                                <Card className="p-4">
                                    <CardBody>
                                        <Form onSubmit={this.handleSubmit}>
                                            <h1>Login</h1>
                                            <p className="text-muted">Sign In to your account</p>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-user"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="text" placeholder="Username" name="txtUsername" value={txtUsername} onChange={this.handleChange} />
                                            </InputGroup>
                                            <InputGroup className="mb-4">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-lock"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="password" placeholder="Password" name="txtPassword" value={txtPassword}
                                                    onChange={this.handleChange}
                                                />
                                            </InputGroup>
                                            <Row>
                                                <Col xs="6">
                                                    <Button color="primary" className="px-4" type="submit">Login</Button>
                                                </Col>
                                                <Col xs="6" className="text-right">
                                                    <Button color="link" className="px-0">Forgot password?</Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </CardGroup>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Login;
