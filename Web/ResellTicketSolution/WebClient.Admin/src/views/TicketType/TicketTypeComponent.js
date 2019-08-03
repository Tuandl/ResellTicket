import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Modal, ModalHeader, ModalBody, ModalFooter, Col, Form, Input, InputGroup, Row, Table } from 'reactstrap';
// import {getTicketTypeRequest} from './../../action/TicketTypeAction';
import PaginationView from '../Pagination/PaginationComponent';
import Axios from 'axios';
import { toastr } from 'react-redux-toastr';


function TicketTypeRow(props) {
    const tickettype = props.tickettype
    const tickettypeLink = `/tickettype/${tickettype.id}`

    return (
        <tr key={tickettype.id.toString()}>
            <th>{props.index + 1}</th>
            <td>{tickettype.name}</td>
            <td>{tickettype.vehicleName}</td>
            <td>
                <Link to={tickettypeLink}>
                    <Button color="primary" className="mr-2">
                        <i className="fa fa-edit fa-lg mr-1"></i>Edit
                    </Button>
                </Link>
                <Button color="danger" className="mr-2" onClick={() => { props.parent.showConfirmDialog(props.tickettype.id) }}>
                        <i className="fa fa-trash fa-lg mr-1"></i>Delete
                </Button>
            </td>
        </tr>


    )
}


class TicketTypeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            userRole: '',
            currentPage: 1,
            pageSize: 5,
            pageCount: 1,
            ticketTypes: [],
            isShowConfirmDialog: false,
            deleteId: ''
        }
    }

    componentWillMount() {
        var token = localStorage.getItem('userToken');
        if (!token) {
            this.props.getTicketTypes();
        }
        var jwt = require('jwt-decode');
        var decode = jwt(token);
        var userRole = decode['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        if (userRole === 'Manager') {
            this.getTicketTypes();
        }
        this.setState({
            userRole: userRole
        })
    }

    getTicketTypes = () => {
        var { pageSize, currentPage } = this.state;
        Axios.get('api/ticketType?param=' + this.state.searchValue + '&page=' + currentPage + '&pageSize=' + pageSize).then(res => {
            this.setState({
                ticketTypes : res.data.data,
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
            this.getTicketTypes();
        })
    }

    async onDelete (id) {
      var res = await Axios.put('api/tickettype/delete?Id=' + id);
      if (res.status === 200) {
        toastr.success('Delete Success', 'Ticket Type is deleted.');
        this.props.history.push('/tickettype');
    } else {
        toastr.error('Error', 'Error when delete Ticket Type');
    }
    this.getTicketTypes();
    }

    showConfirmDialog = (id) => {
      this.setState({
          isShowConfirmDialog: true,
          deleteId: id
      });
  }

  closeConfirmDialog = () => {
      this.setState({
          isShowConfirmDialog: false
      });
  }

  onConfirm = async () => {
    toastr.info('Deleting', 'Waiting for delete');
    this.onDelete(this.state.deleteId);
    this.setState({
        isShowConfirmDialog: false
    });
}

    render() {
        var { searchValue, userRole, ticketTypes, pageCount, currentPage } = this.state;
        return(
            userRole === 'Manager' ?
            <div className="animated fadeIn">
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardHeader>
                                    <Link to='/tickettype/add'>
                                        <Button className="text-right" color="primary">
                                            <i className="fa fa-plus fa-lg mr-1"></i>Create Ticket Type
                                        </Button>
                                    </Link>
                                    <Form className="text-right mr-2" onSubmit={this.onSubmit}>
                                        <InputGroup>
                                            <Input type="text" className="mr-2" placeholder="Name"
                                                name="searchValue" value={searchValue} onChange={this.onChange} />
                                            <Button color="primary">
                                                <i className="fa fa-search fa-lg mr-1"></i>Search Ticket Type
                                                </Button>
                                        </InputGroup>
                                    </Form>

                                </CardHeader>
                                <CardBody>
                                    <Table responsive hover>
                                        <thead>
                                            <tr>
                                                <th>No.</th>
                                                <th>Name</th>
                                                <th>Vehicle Name</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ticketTypes.map((tickettype, index) =>
                                                <TicketTypeRow key={index} tickettype={tickettype} index={index} parent={this}/>
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
                    <Modal isOpen={this.state.isShowConfirmDialog}
                    className="modal-danger">
                    <ModalHeader toggle={this.closeConfirmDialog}>Confirm Delete Ticket Type</ModalHeader>
                    <ModalBody>
                        Do you want to delete this ticket type?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.onConfirm}>Confirm</Button>
                        <Button color="secondary" onClick={this.closeConfirmDialog}>Cancel</Button>
                    </ModalFooter>
                    </Modal>
                </div> : ''
        );
    };
}

// const mapStateToProps = state => {
//     return {
//         ticketTypes: state.ticketTypes
//     }
// }

// const mapDispatchToProps = (dispatch, props)=>{
//     return {
//         getTicketTypes: () => {
//             dispatch(getTicketTypeRequest());
//         },
//         getTicketTypesByName: (param) => {
//             dispatch(getTicketTypeRequest(param));
//         }
//     }
// }

export default TicketTypeComponent;
