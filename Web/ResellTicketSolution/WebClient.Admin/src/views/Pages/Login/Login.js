import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { doLoginRequest } from "./../../../action/Actions";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txtUsername: '',
            txtPassword: '',
            //token: '',
        };
        // this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(props) {
        // this.setState({
        //     token : props.token
        // })
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { txtUsername, txtPassword } = this.state;
        if (txtUsername && txtPassword) {
            this.props.onLogin(txtUsername, txtPassword);
        }
    }

    render() {
        //submitted
        const { txtUsername, txtPassword } = this.state;
        var token = this.props.token;
        if(token !== null && token !== '') {
            if (parseInt(token) === 406) {
            
            } else {
                return <Redirect to={{
                    pathname: '/dashboard'
                }}
                />
            }
        }

        
        // 
        //     
        // }


        return (
            <div className="app flex-row align-items-center">
                <Container> {/*div: class="container"*/}
                    <Row className="justify-content-center"> {/*div: class="justify-content-center row"*/}
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
                                                <Input type="text" placeholder="Username" name="txtUsername" value={txtUsername}
                                                    onChange={this.handleChange} />
                                            </InputGroup>
                                            <InputGroup className="mb-4">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-lock"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="password" placeholder="Password" name="txtPassword"
                                                    value={txtPassword} onChange={this.handleChange}
                                                />
                                            </InputGroup>
                                            <Row>
                                                <Col xs="6">
                                                    {/*<Link to="/">*/}
                                                    <Button color="primary" className="px-4" type="submit">Login</Button>
                                                    {/*</Link>*/}
                                                </Col>
                                                <Col xs="6" className="text-right">
                                                    <Button color="link" className="px-0">Forgot password?</Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </CardBody>
                                </Card>
                                {/* <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                                    <CardBody className="text-center">
                                        <div>
                                            <h2>Sign up</h2>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                                                labore et dolore magna aliqua.</p>
                                            <Link to="/register">
                                                <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                                            </Link>
                                        </div>
                                    </CardBody>
                                </Card> */}
                            </CardGroup>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        token: state.loginToken
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onLogin: (username, password) => {
            dispatch(doLoginRequest(username, password));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
