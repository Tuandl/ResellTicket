import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Row, Table, Button, Container, Form, Input, InputGroup } from 'reactstrap';
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
            <td>{user.fullName}</td>
            <td>{user.email}</td>
            <td>{user.phoneNumber}</td>
            <td>Manager</td>
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
    constructor(props) {
        super(props);
        this.state = {
            searchValue : ''
        }
    }

    componentWillMount() {
        var token = localStorage.getItem('userToken');
        this.props.getUsers(token);
    }

    componentWillReceiveProps(props) {

    }

    onChange = (event) => {
        var {name, value} = event.target;
        this.setState({
            [name] : value
        })
    }

    onSubmit = (event) => {
        event.preventDefault();
        this.props.getUsersByName(this.state.searchValue);
    }

    render() {
        //var {users} = this.props;
        const userList = this.props.users;
        var {searchValue} = this.state;
        return (
            <Container>
                <div className="animated fadeIn">
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardHeader>
                                    <Link to='/register'>
                                        <Button className="text-right" color="primary">
                                            <i className="fa fa-plus fa-lg mr-1"></i>Create User
                                        </Button>
                                    </Link>
                                    <Form className="text-right mr-2" onSubmit={this.onSubmit}>
                                        <InputGroup>
                                            <Input type="text" className="mr-2" placeholder="Username or Fullname" 
                                                    name="searchValue" value={searchValue} onChange={this.onChange}/>
                                            <Button color="primary">
                                                <i className="fa fa-search fa-lg mr-1"></i>Search User
                                                </Button>
                                        </InputGroup>
                                    </Form>

                                </CardHeader>
                                <CardBody>
                                    <Table responsive hover>
                                        <thead>
                                            <tr>
                                                <th>No.</th>
                                                <th>Username</th>
                                                <th>Fullname</th>
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
            </Container>
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
        getUsers: () => {
            dispatch(getUsersRequest());
        },
        getUsersByName: (param) => {
            dispatch(getUsersRequest(param));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);
