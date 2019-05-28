import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { doRegisterRequest } from "./../Action/UserAction";

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        userName: '',
        password: '',
        email: ''
      },
      submitted: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        [name]: value
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ submitted: true });
    const { user } = this.state;
    if (user.userName && user.password && user.email) {
      this.props.onRegister(user);
    }

  }

  render() {

    const { user  } = this.state;

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form name="form" onSubmit={this.handleSubmit}>
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Username" autoComplete="username" value={user.userName} name="userName" onChange={this.handleChange} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Email" autoComplete="email" value={user.email} name="email" onChange={this.handleChange} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Password" autoComplete="new-password" value={user.password} name="password" onChange={this.handleChange} />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Repeat password" autoComplete="new-password" value={user.password} name="password" onChange={this.handleChange} />
                    </InputGroup>
                    <Button color="success" type="submit" block>Create Account</Button>
                  </Form>
                </CardBody>
                <CardFooter className="p-4">
                  <Row>
                    <Col xs="12" sm="6">
                      <Button className="btn-facebook mb-1" block><span>facebook</span></Button>
                    </Col>
                    <Col xs="12" sm="6">
                      <Button className="btn-twitter mb-1" block><span>twitter</span></Button>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {

  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    onRegister: (user) =>{
      dispatch(doRegisterRequest(user));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
