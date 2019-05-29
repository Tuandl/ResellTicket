import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import { connect } from 'react-redux';
import { findUserByIdRequest } from "./../../action/UserAdminAction";

// import usersData from './UsersData'

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
            }
        }
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

    render() {

        // const user = usersData.find( user => user.id.toString() === this.props.match.params.id)

        // const userDetails = user ? Object.entries(user) : [['id', (<span><i className="text-muted icon-ban"></i> Not found</span>)]]
        var {user} = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col lg={6}>
                        <Card>
                            <CardHeader>
                                <strong><i className="icon-info pr-1"></i>User Details</strong>
                            </CardHeader>
                            <CardBody>
                                <Table responsive striped hover>
                                    <tbody>
                                        {/* {
                                            userDetails.map(([key, value]) => {
                                                return (
                                                    <tr key={key}>
                                                        <td>{`${key}:`}</td>
                                                        <td><strong>{value}</strong></td>
                                                    </tr>
                                                )
                                            })
                                        } */}
                                        <tr>
                                            <td>Username</td>
                                            <td><strong>{user.userName}</strong></td>
                                        </tr>
                                        <tr>
                                            <td>Fullname</td>
                                            <td><strong>{user.fullName}</strong></td>
                                        </tr>
                                        <tr>
                                            <td>Email</td>
                                            <td><strong>{user.email}</strong></td>
                                        </tr>
                                        <tr>
                                            <td>Phone</td>
                                            <td><strong>{user.phoneNumber}</strong></td>
                                        </tr>
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

