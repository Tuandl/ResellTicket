import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Row, Table, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { getUsersRequest } from "./../../action/UserAdminAction";

// import usersData from './UsersData'

function UserRow(props) {
    const user = props.user
    const userLink = `/user/${user.id}`

    // const getBadge = (status) => {
    //     return status === 'Active' ? 'success' :
    //         status === 'Inactive' ? 'secondary' :
    //             status === 'Pending' ? 'warning' :
    //                 status === 'Banned' ? 'danger' :
    //                     'primary'
    // }

    return (
        <tr key={user.id.toString()}>
            <th>{props.index + 1}</th>
            <td>{user.userName}</td>
            <td>{user.email}</td>
            <td>{user.phoneNumber}</td>
            <td>{user.role}</td>
            <td>
                <Link to={userLink}>
                    <Button color="danger">
                        <i className="fa fa-edit fa-lg mr-1"></i>Edit
                    </Button>
                </Link>
            </td>
        </tr>


    )
}

class Users extends Component {

    componentWillMount() {
        var token = localStorage.getItem('userToken');
        this.props.getUsers(token);
    }

    componentWillReceiveProps(props) {

    }

    onCreateUser = () => {

    }

    render() {
        //var {users} = this.props;
        const userList = this.props.users;

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Users
                                <Link to='/register'>
                                    <Button className="text-right" color="primary">Create User</Button>
                                </Link>
                            </CardHeader>
                            <CardBody>
                                <Table responsive hover>
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Role</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userList.map((user, index) =>
                                            <UserRow key={index} user={user} index={index} />
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

const mapStateToProps = state => {
    return {
        users: state.users
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getUsers: (token) => {
            dispatch(getUsersRequest(token));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);
