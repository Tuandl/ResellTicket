import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Form, Input, InputGroup, Row, Table } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';

function TicketRow(props) {
    const ticket = props.ticket
    //const userLink = `/user/${user.id}`

    // const getBadge = (isActive) => {
    //     if (isActive === true) {
    //         return (
    //             <Badge color="success">Active</Badge>
    //         )
    //     } else {
    //         return (
    //             <Badge color="danger">Inactive</Badge>
    //         )
    //     }
    // }

    return (
        <tr>
            <th>{props.index + 1}</th>
            <td>{ticket.ticketCode}</td>
            <td>{ticket.departureDate}</td>
            <td>{ticket.arrivalDate}</td>
            <td>{ticket.sellerPhone}</td>
            <td>{ticket.price}</td>
            <td>{ticket.feeAmount}</td>
            <td>{ticket.status}</td>
            <td>
                <Button color="success" className="mr-2">
                    <i className="fa fa-edit fa-lg mr-1"></i>Valid
                </Button>
                <Button color="danger">
                    <i className="fa fa-edit fa-lg mr-1"></i>Invalid
                </Button>
            </td>
        </tr>


    )
}

class NewPostedTickets extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tickets: [],
            isLogin: false,
            userRole: '',
        }
    }

    componentWillMount() {
        var token = localStorage.getItem('userToken');
        if (token) {
            this.setState({
                isLogin: true
            })
            var jwt = require('jwt-decode');
            var decode = jwt(token);
            var userRole = decode['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            if (userRole === 'Staff') {
                this.getTickets();
                this.setState({
                    userRole: userRole
                })
            }
        } 
    }

    getTickets = async () => {
        await Axios.get('api/ticket').then(res => {
            this.setState({
                tickets: res.data
            })
            //console.log(this.state.tickets);
        });

    }



    render() {
        var { tickets, isLogin, userRole } = this.state
        return (
            isLogin ? userRole === 'Staff' ?
                <div className="animated fadeIn">
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardHeader>
                                    {/* <Link to='/user/add'>
                                    <Button className="text-right" color="primary">
                                        <i className="fa fa-plus fa-lg mr-1"></i>Create User
                                        </Button>
                                </Link> */}
                                    <Form className="text-right mr-2" onSubmit={this.onSubmit}>
                                        <InputGroup>
                                            <Input type="text" className="mr-2" placeholder="" /> {/*name="searchValue" value={searchValue} onChange={this.onChange}*/}
                                            <Button color="primary">
                                                <i className="fa fa-search fa-lg mr-1"></i>Search Ticket
                                                </Button>
                                        </InputGroup>
                                    </Form>

                                </CardHeader>
                                <CardBody>
                                    <Table responsive hover>
                                        <thead>
                                            <tr>
                                                <th>No.</th>
                                                <th>Ticket Code</th>
                                                <th>Departure</th>
                                                <th>Arrival</th>
                                                <th>Seller Phone</th>
                                                <th>Price</th>
                                                <th>Fee Amount</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tickets.map((ticket, index) =>
                                                <TicketRow key={index} ticket={ticket} index={index} />
                                            )}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
                : ''
                : <Redirect to="/login" />

        )
    }
}

export default NewPostedTickets