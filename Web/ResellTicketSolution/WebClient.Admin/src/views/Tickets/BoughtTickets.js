import Axios from 'axios';
import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Redirect, Link } from 'react-router-dom';
import {
    Badge, Button, Card, CardBody, CardHeader, Col, Form, Input, InputGroup, Row, Table,
    Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import PaginationView from '../Pagination/PaginationComponent';
import TicketStatus from './TicketStatus';

function TicketRow(props) {
    const { ticket } = props;
    const getBadge = (status) => {
        if (status === TicketStatus.Bought) {
            return (
                <Badge color="success">Bought</Badge>
            )
        } else if (status === TicketStatus.Expired) {
            return (
                <Badge color="secondary">Expired</Badge>
            )
        }
    }
    const ticketLink = `/boughtTicket/${ticket.id}`

    // setRenamedFailWhenBoughtTicketExpired() {
    //     this.props.showDialogConfirmFail(ticket.id);
    // }

    return (
        <tr>
            <th>{props.index + 1}</th>
            <td>{ticket.ticketCode}</td>
            <td>{ticket.departureCity} - {moment(ticket.departureDateTime).format('ddd, MMM DD YYYY, HH:mm')}</td>
            <td>{ticket.arrivalCity} - {moment(ticket.arrivalDateTime).format('ddd, MMM DD YYYY, HH:mm')}</td>
            {/* <td>{ticket.sellerPhone}</td> */}
            <td>{<NumberFormat value={ticket.sellingPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</td>
            <td>{getBadge(ticket.status)}</td>
            <td>
                <Link to={ticketLink}>
                    {/* onClick={() => { parent.onInValidSaveChanges(ticket.id) }} */}
                    <Button color="secondary" className="mr-2">
                        <i className="fa fa-edit fa-lg mr-1"></i>Details
                    </Button>
                </Link>
                {ticket.status === TicketStatus.Expired
                    ? <Button color="danger" className="mr-2" onClick={() => props.showDialogConfirmFail(ticket.id)}>
                        <i className="fa fa-edit fa-lg mr-1"></i>Renamed Fail
                    </Button>
                    : null
                }
            </td>
        </tr>

    )
}

class BoughtTickets extends Component {
    expiredTicketId = 0;

    constructor(props) {
        super(props);
        this.state = {
            tickets: [],
            isLogin: false,
            userRole: '',
            searchParam: '',
            currentPage: 1,
            pageSize: 5,
            pageCount: 1,
            ticketIdDialog: null,
            isShowConfirmDiaLog: false
        }
        this.showDialogConfirmFail = this.showDialogConfirmFail.bind(this);
        this.closeDialogConfirmFail = this.closeDialogConfirmFail.bind(this);
    }

    componentWillMount() {
        var OneSignal = window.OneSignal || [];
        var self = this
        OneSignal.on('notificationDisplay', function (event) {
            if (event.content.indexOf('renamed') !== -1) {
                self.getBoughtTickets();
            }
        });
        var token = localStorage.getItem('userToken');
        if (token) {
            this.setState({
                isLogin: true
            })
            var jwt = require('jwt-decode');
            var decode = jwt(token);
            var userRole = decode['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            if (userRole === 'Staff') {
                this.getBoughtTickets();
                this.setState({
                    userRole: userRole
                })
            }
        }
    }

    showDialogConfirmFail(id) {
        this.expiredTicketId = id;
        this.setState({
            isShowConfirmDiaLog: true,
            //ticketIdDialog: id
        });
    }

    closeDialogConfirmFail() {
        this.setState({
            isShowConfirmDiaLog: false,
            //ticketIdDialog: null
        });
    }

    getBoughtTickets = () => {
        var { pageSize, currentPage } = this.state;
        Axios.get('api/ticket/bought?param=' + this.state.searchParam + '&page=' + currentPage + '&pageSize=' + pageSize).then(res => {
            this.setState({
                tickets: res.data.data,
                pageCount: res.data.total <= pageSize ? 1 : res.data.total % pageSize === 0 ? parseInt(res.data.total / pageSize) : parseInt(res.data.total / pageSize) + 1
            })
        });

    }

    onChange = (event) => {
        var { name, value } = event.target;
        this.setState({
            [name]: value
        })
    }

    onSearch = (event) => {
        event.preventDefault();
        this.setState({
            currentPage: 1
        }, () => {
            this.getBoughtTickets()
        })
    }

    // onInValidSaveChanges = (id) => {
    //     Axios.put('api/ticket/reject/' + id).then(res => {
    //         this.closeDialogConfirm();
    //         if (res.status === 200) {
    //             toastr.success('Reject Success', 'Ticket has been rejected.');
    //             // this.props.history.push('/ticket');
    //             this.getBoughtTickets();
    //         } else {
    //             toastr.error('Error', 'Error when reject Ticket');
    //         }
    //     })
    // }

    goPage = (pageNumber) => {
        this.setState({
            currentPage: pageNumber === 'prev' ? this.state.currentPage - 1 :
                pageNumber === 'next' ? this.state.currentPage + 1 :
                    pageNumber
        }, () => {
            this.getBoughtTickets();
        })
    }

    setRenamedFailWhenBoughtTicketExpired = (id) => {
        try {
            Axios.put('api/ticket/expiredBoughtTicket/' + id).then(res => {
                this.closeDialogConfirmFail()
                if(res.status === 200) {
                    toastr.success('Update Success', 'Ticket is renamed fail.')
                    this.getBoughtTickets();
                } 
            })
        } catch (error) {
            toastr.error('Update Fail', '');
        }
    }

    render() {
        var { tickets, isLogin, userRole, currentPage, pageCount } = this.state
        return (
            isLogin ? userRole === 'Staff' ?
                <div className="animated fadeIn">
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardHeader>
                                    <Form className="text-right mr-2" onSubmit={this.onSearch}>
                                        <InputGroup>
                                            <Input type="text" className="mr-2" placeholder="Searchcode" name="searchParam" value={this.state.searchParam} onChange={this.onChange} />
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
                                                <th>Arrival</th>
                                                {/* <th>Seller Phone</th> */}
                                                <th>Price</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tickets.map((ticket, index) =>
                                                <TicketRow key={index} ticket={ticket} index={index} parent={this} 
                                                    showDialogConfirmFail={this.showDialogConfirmFail}/>
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
                    <Modal isOpen={this.state.isShowConfirmDiaLog}
                        className="modal-danger">
                        <ModalHeader toggle={this.closeDialogConfirmFail}>Confirm Renamed Ticket Fail</ModalHeader>
                        <ModalBody>
                            Do you want to set this ticket is renamed fail?
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onClick={() => this.setRenamedFailWhenBoughtTicketExpired(this.expiredTicketId)}>Confirm</Button>
                            <Button color="secondary" onClick={this.closeDialogConfirm}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </div>
                : ''
                : <Redirect to="/login" />

        )
    }
}

export default BoughtTickets;
