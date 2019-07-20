import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Badge, Button, Card, CardBody, CardHeader, Col, Form, Input, InputGroup, Row, Table } from 'reactstrap';
    import Axios from 'axios';
// import { getUsersRequest } from "../../action/UserAdminAction";
import PaginationView from '../Pagination/PaginationComponent';

// import usersData from './UsersData'

function UserRow(props) {
    const user = props.user
    const userLink = `/user/${user.id}`

    const getBadge = (isActive) => {
        if (isActive === true) {
            return (
                <Badge color="success">Active</Badge>
            )
        } else {
            return (
                <Badge color="danger">Inactive</Badge>
            )
        }
    }

    return (
        <tr key={user.id.toString()}>
            <th>{props.index + 1}</th>
            <td>{user.userName}</td>
            <td>{user.fullName}</td>
            <td>{user.email}</td>
            <td>{user.phoneNumber}</td>
            <td>{user.roleId}</td>
            <td>{getBadge(user.isActive)}</td>
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

class UsersComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            userRole: '',
            userList: [],
            currentPage: 1,
            pageSize: 5,
            pageCount: 1
        }
    }

    componentWillMount() {
        var token = localStorage.getItem('userToken');
        if (!token) {
            this.getUsers();
        }
        var jwt = require('jwt-decode');
        var decode = jwt(token);
        var userRole = decode['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        if (userRole === 'Manager') {
            this.getUsers();
        }
        this.setState({
            userRole: userRole
        })
    }

    getUsers = () => {
        var { pageSize, currentPage } = this.state;
        Axios.get('api/user?param=' + this.state.searchValue + '&page=' + currentPage + '&pageSize=' + pageSize).then(res => {
            this.setState({
                userList : res.data.data,
                pageCount : res.data.total <= pageSize ? 1 : res.data.total % pageSize === 0 ? parseInt(res.data.total / pageSize) : parseInt(res.data.total / pageSize) + 1
            })
        });
    }

    onChange = (event) => {
        var { name, value } = event.target;
        this.setState({
            [name]: value
        })
    }

    onSubmit = (event) => {
        event.preventDefault();
        this.setState({
            currentPage: 1
        }, () => {
            this.getUsers()
        })
    }

    goPage = (pageNumber) => {
        this.setState({
            currentPage: pageNumber === 'prev' ? this.state.currentPage - 1 :
                pageNumber === 'next' ? this.state.currentPage + 1 :
                    pageNumber
        }, () => {
            this.getUsers();
        })
    }

    render() {
        var { searchValue, userRole, userList, currentPage, pageCount } = this.state;
        return (
            userRole === 'Manager' ?
                <div className="animated fadeIn">
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardHeader>
                                    <Link to='/user/add'>
                                        <Button className="text-right" color="primary">
                                            <i className="fa fa-plus fa-lg mr-1"></i>Create User
                                        </Button>
                                    </Link>
                                    <Form className="text-right mr-2" onSubmit={this.onSubmit}>
                                        <InputGroup>
                                            <Input type="text" className="mr-2" placeholder="Username or Fullname"
                                                name="searchValue" value={searchValue} onChange={this.onChange} />
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
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userList.map((user, index) =>
                                                <UserRow key={index} user={user} index={index} />
                                            )}
                                        </tbody>
                                    </Table>
                                    <div style={{ float: 'right' }}>
                                        <PaginationView currentPage={currentPage} pageCount={pageCount} goPage={this.goPage} />
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div> : ''
        )
    }
}

// const mapStateToProps = state => {
//     return {
//         users: state.users
//     }
// }

// const mapDispatchToProps = (dispatch, props) => {
//     return {
//         getUsers: () => {
//             dispatch(getUsersRequest());
//         },
//         getUsersByName: (param) => {
//             dispatch(getUsersRequest(param));
//         }
//     }
// }

export default UsersComponent;
