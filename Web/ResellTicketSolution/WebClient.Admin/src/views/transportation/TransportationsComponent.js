import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Form, Input, InputGroup, Row, Table} from 'reactstrap';
// import {getTransportationRequest} from './../../action/UserAdminAction'
import PaginationView from '../Pagination/PaginationComponent';
import Axios from 'axios';



function TransportationRow(props) {
    const transportation = props.transportation
    const transportationLink = `/transportation/${transportation.id}`

    return (
        <tr key={transportation.id.toString()}>
            <th>{props.index + 1}</th>
            <td>{transportation.name}</td>
            <td>{transportation.phoneNumber}</td>
            <td>{transportation.email}</td>
            <td>{transportation.vehicleName}</td>
            <td>
                <Link to={transportationLink}>
                    <Button color="danger">
                        <i className="fa fa-edit fa-lg mr-1"></i>Edit
                    </Button>
                </Link>
            </td>
        </tr>


    )
}


class TransportationsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            userRole: '',
            transportations: [],
            currentPage: 1,
            pageSize: 5,
            pageCount: 1
        }
    }

    componentWillMount() {
        var token = localStorage.getItem('userToken');
        if (!token) {
            this.props.getTransportations();
        }
        var jwt = require('jwt-decode');
        var decode = jwt(token);
        var userRole = decode['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        if (userRole === 'Manager') {
            this.getTransportations();
        }
        this.setState({
            userRole: userRole
        })
    }

    getTransportations = () => {
        var { pageSize, currentPage } = this.state;
        Axios.get('api/transportation?param=' + this.state.searchValue + '&page=' + currentPage + '&pageSize=' + pageSize).then(res => {
            this.setState({
                transportations : res.data.data,
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
            this.getTransportations()
        })
    }

    goPage = (pageNumber) => {
        this.setState({
            currentPage: pageNumber === 'prev' ? this.state.currentPage - 1 :
                pageNumber === 'next' ? this.state.currentPage + 1 :
                    pageNumber
        }, () => {
            this.getTransportations();
        })
    }

    render() {
        var { searchValue, userRole, currentPage, pageCount, transportations } = this.state;
        return(
            userRole === 'Manager' ?
            <div className="animated fadeIn">
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardHeader>
                                    <Link to='/transportation/add'>
                                        <Button className="text-right" color="primary">
                                            <i className="fa fa-plus fa-lg mr-1"></i>Create Transportation
                                        </Button>
                                    </Link>
                                    <Form className="text-right mr-2" onSubmit={this.onSubmit}>
                                        <InputGroup>
                                            <Input type="text" className="mr-2" placeholder="Name"
                                                name="searchValue" value={searchValue} onChange={this.onChange} />
                                            <Button color="primary">
                                                <i className="fa fa-search fa-lg mr-1"></i>Search Transportation
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
                                                <th>Phone Number</th>
                                                <th>Email</th>
                                                <th>Vehicle Name</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transportations.map((transportation, index) =>
                                                <TransportationRow key={index} transportation={transportation} index={index} />
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
        );
    };
} 

// const mapStateToProps = state => {
//     return {
//         transportations: state.transportations
//     }
// }

// const mapDispatchToProps = (dispatch, props)=>{
//     return {
//         getTransportations: () => {
//             dispatch(getTransportationRequest());
//         },
//         getTransportationsByName: (param) => {
//             dispatch(getTransportationRequest(param));
//         }
//     }
// }

export default TransportationsComponent;