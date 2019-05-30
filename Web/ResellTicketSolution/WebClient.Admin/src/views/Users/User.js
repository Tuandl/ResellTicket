import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { findUserByIdRequest } from "./../../action/UserAdminAction";

class User extends Component {

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
            }
        }

        this.handleOnChanged = this.handleOnChanged.bind(this);
    }

    componentWillMount() {
        var { match } = this.props;
        var userId = match.params.id;
        console.log(userId);
        this.props.findUserById(userId);
    }

    componentWillReceiveProps(props) {
        var { user } = props;
        console.log(user);
        this.setState({
            user: user
        })
    }

    getRoleOptions() {
        if (this.state.roles) {
            this.state.roles.map((role, index) => {
                return (
                    <option key={index} value={role.id}>{role.name}</option>
                );
            });
        } else {
            return null;
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

    onBtnSaveChangesClicked() {

    }

    onBtnCancleClicked() {

    }

    render() {
        var { user } = this.state;

        var roleOptions = this.getRoleOptions();

        console.log(this.state);

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

export default connect(mapStateToProps, mapDispatchToProps)(User);

