import Axios from 'axios';
import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Redirect } from 'react-router-dom';
import { Badge, Button, Card, CardBody, CardHeader, Col, Form, Input, InputGroup, Row, Table } from 'reactstrap';

function TicketRow(props) {
    const {ticket} = props;
    const getBadge = (status) => {
      if (status === 2) {
          return (
              <Badge color="success">Valid</Badge>
          )
      }
    }
    return (
        <tr>
            <th>{props.index + 1}</th>
            <td>{ticket.ticketCode}</td>
            <td>{ticket.departureDate}</td>
            <td>{ticket.arrivalDate}</td>
            <td>{ticket.sellerPhone}</td>
            <td>{ticket.price}</td>
            <td>{ticket.feeAmount}</td>
            <td>{getBadge(ticket.status)}</td>
            <td>
                <Button color="success" className="mr-2">
                    <i className="fa fa-edit fa-lg mr-1"></i>Valid
                </Button>
            </td>
        </tr>


    )
}

class ValidTickets extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tickets: [],
            isLogin: false,
            userRole: '',
            searchParam: ''
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
                this.getValidTickets();
                this.setState({
                    userRole: userRole
                })
            }
        }
    }

    // getTickets = async () => {
    //     await Axios.get('api/ticket').then(res => {
    //         this.setState({
    //             tickets: res.data
    //         })
    //         // console.log(this.state.tickets);
    //     });

    // }
    getValidTickets = () => {
      Axios.get('api/ticket/valid').then(res => {
          this.setState({
              tickets: res.data
          })
          // console.log(this.state.tickets);
      });

  }

    onSaveChanges = (id) => {
      Axios.put('api/ticket/' + id).then(res => {
          if(res.status === 200) {
              toastr.success('Update Success', 'Ticket has been valid successfully.');
              // this.props.history.push('/ticket');
          } else {
              toastr.error('Error', 'Error when valid Ticket');
          }
      })
  }

  onChange = (event) => {
    var {name, value} = event.target;
    this.setState({
        [name] : value
    })
  }
  
  onSearch = (event) => {
    event.preventDefault();
    //console.log(this.state.searchParam);
    Axios.get('api/ticket/search?param=' + this.state.searchParam).then(res => {
        console.log(res)
        this.setState({
            tickets : res.data
        })
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
                                    <Form className="text-right mr-2" onSubmit={this.onSearch}>
                                        <InputGroup>
                                            <Input type="text" className="mr-2" placeholder="Ticketcode" name="searchParam" value={this.state.searchParam} onChange={this.onChange}/>
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

export default ValidTickets;
