import Axios from 'axios';
import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Redirect } from 'react-router-dom';
import { Badge, Button, Card, CardBody, CardHeader, Col, Form, Input, InputGroup, Row, Table } from 'reactstrap';
import moment from 'moment';
import NumberFormat from 'react-number-format';

function TicketRow(props) {
    const {ticket, parent} = props;
    const getBadge = (status) => {
      if (status == 5) {
          return (
              <Badge color="success">Renamed</Badge>
          )
      }
    }
    return (
        <tr>
            <th>{props.index + 1}</th>
            <td>{ticket.ticketCode}</td>
            <td>{ticket.departureCity}</td>
            <td>{moment(ticket.departureDateTime).format('MMM DD YYYY')}</td>
            <td>{ticket.arrivalCity}</td>
            <td>{moment(ticket.arrivalDateTime).format('MMM DD YYYY')}</td>
            {/* <td>{ticket.sellerPhone}</td> */}
            <td>{<NumberFormat value={ticket.sellingPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</td>
            <td>{getBadge(ticket.status)}</td>
            <td>
                <Button color="success" className="mr-2" onClick={() => {parent.onValidSaveChanges(ticket.id)}}>
                    <i className="fa fa-edit fa-lg mr-1"></i>Valid
                </Button>
                <Button color="danger" className="mr-2" onClick={() => {parent.onInValidSaveChanges(ticket.id)}}>
                    <i className="fa fa-edit fa-lg mr-1"></i>Invalid
                </Button>
            </td>
        </tr>


    )
}

class RenamedTickets extends Component {

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
                this.getRenamedTickets();
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
    getRenamedTickets = () => {
      Axios.get('api/ticket/renamed').then(res => {
          this.setState({
              tickets: res.data
          })
          // console.log(this.state.tickets);
      });

  }

    onChange(event) {
      var {name, value} = event.target;
      this.setState({
          [name] : value
      })
    }

    onSearch(event) {
      event.preventDefault();
      //console.log(this.state.searchParam);
      Axios.get('api/ticket?param=' + this.state.searchParam).then(res => {
          console.log(res)
          this.setState({
              tickets : res.data
          })
      });
  }

    onValidSaveChanges = (id) => {
      var renamedSuccess = true;
      Axios.post('api/ticket/validate-rename?id=' + id +'&renameSuccess=' + renamedSuccess).then(res => {
          if(res.status === 200) {
              toastr.success('Valid Success', 'Ticket has been valid successfully.');
              this.getRenamedTickets();
              // this.props.history.push('/ticket');
          } else {
              toastr.error('Error', 'Error when valid Ticket');
          }
      })
  }

  onInValidSaveChanges = (id) => {
    var renamedSuccess = false;
    Axios.post('api/ticket/validate-rename?id=' + id + '&renameSuccess=' + renamedSuccess).then(res => {
        if(res.status === 200) {
            toastr.success('Invalid Success', 'Ticket has been invalid successfully.');
            this.getRenamedTickets();
            // this.props.history.push('/ticket');
        } else {
            toastr.error('Error', 'Error when valid Ticket');
        }
    })
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
                                            <Input type="text" className="mr-2" placeholder="Searchcode" name="searchParam" value={this.state.searchParam} onChange={this.onChange}/>
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
                                                <th>Code</th>
                                                <th>Departure</th>
                                                <th>Departure Time</th>
                                                <th>Arrival</th>
                                                <th>Arrival Time</th>
                                                {/* <th>Seller Phone</th> */}
                                                <th>Price</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tickets.map((ticket, index) =>
                                                <TicketRow key={index} ticket={ticket} index={index} parent={this}/>
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

export default RenamedTickets;
