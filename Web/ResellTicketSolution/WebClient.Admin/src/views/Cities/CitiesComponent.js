import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, CardHeader, Col, Form, Input, InputGroup, Row, Table } from 'reactstrap';
import Axios from 'axios';
import PaginationView from '../Pagination/PaginationComponent';
import { toastr } from 'react-redux-toastr';

function CityRow(props) {
    const city = props.city
    const cityLink = `/city/${city.id}`
    return (
        <tr>
            <th>{props.index + 1}</th>
            <td>{city.name}</td>
            <td>{city.timeZoneId}</td>
            <td>
                <Link to={cityLink}>
                    <Button color="danger" className="mr-2">
                        <i className="fa fa-edit fa-lg mr-1"></i>Edit
                    </Button>
                </Link>
                <Button color="danger" className="mr-2" onClick={() => { props.parent.showConfirmDialog(props.city.id) }}>
                        <i className="fa fa-delete fa-lg mr-1"></i>Delete
                </Button>
            </td>
        </tr>


    )
}

class CitiesComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: [],
            isLogin: false,
            userRole: '',
            searchValue: '',
            currentPage: 1,
            pageSize: 5,
            pageCount: 1,
            isShowConfirmDialog: false,
            deleteId: ''
        }
        this.onSearch = this.onSearch.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onDelete = this.onDelete.bind(this);

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
            if (userRole === 'Manager') {
                this.getCities();
                this.setState({
                    userRole: userRole
                })
            }
        }

    }

    getCities = () => {
        var { pageSize, currentPage } = this.state;
        Axios.get('api/city?param=' + this.state.searchValue + '&page=' + currentPage + '&pageSize=' + pageSize).then(res => {
            this.setState({
                cities : res.data.data,
                pageCount : res.data.total <= pageSize ? 1 : res.data.total % pageSize === 0 ? parseInt(res.data.total / pageSize) : parseInt(res.data.total / pageSize) + 1
            })
        });
    }

    onChange(event) {
        var { name, value } = event.target;
        this.setState({
            [name]: value
        })
    }

    onSearch(event) {
        event.preventDefault();
        //console.log(this.state.searchValue);
        this.setState({
            currentPage: 1
        }, () => {
            this.getCities()
        })
    }

    goPage = (pageNumber) => {
        this.setState({
            currentPage: pageNumber === 'prev' ? this.state.currentPage - 1 :
                pageNumber === 'next' ? this.state.currentPage + 1 :
                    pageNumber
        }, () => {
            this.getCities();
        })
    }

    async onDelete (id) {
      var res = await Axios.put('api/city/delete?Id=' + id);
      if (res.status === 200) {
        toastr.success('Delete Success', 'City is deleted.');
        this.props.history.push('/city');
    } else {
        toastr.error('Error', 'Error when delete City');
    }
    this.getCities();
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
        var { cities, currentPage, pageCount, userRole } = this.state;
        return (
            userRole === 'Manager' ?
            <div className="animated fadeIn">
                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                <Link to='/city/add'>
                                    <Button className="text-right" color="primary">
                                        <i className="fa fa-plus fa-lg mr-1"></i>Create City
                                    </Button>
                                </Link>
                                <Form className="text-right mr-2" onSubmit={this.onSearch}>
                                    <InputGroup>
                                        <Input type="text" className="mr-2" placeholder="Cityname"
                                            value={this.state.searchValue} name="searchValue" onChange={this.onChange} />
                                        <Button color="primary">
                                            <i className="fa fa-search fa-lg mr-1"></i>Search City
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
                                            <th>Time Zone</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cities.map((city, index) =>
                                            <CityRow key={index} city={city} index={index} parent={this}/>
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
                    <ModalHeader toggle={this.closeConfirmDialog}>Confirm Delete City</ModalHeader>
                    <ModalBody>
                        Do you want to delete this city?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.onConfirm}>Confirm</Button>
                        <Button color="secondary" onClick={this.closeConfirmDialog}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div> : ''
        )
    }
}

export default CitiesComponent;
