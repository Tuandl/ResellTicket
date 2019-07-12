import Axios from 'axios';
import React, { Component } from 'react';
// import { toastr } from 'react-redux-toastr';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Form, Input, InputGroup, Row, Table } from 'reactstrap';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import PaginationView from '../Pagination/PaginationComponent';


function RouteRow(props) {
    const { route } = props;
    const routeLink = `/boughtRoute/${route.id}`
    return (
        <tr>
            <th>{props.index + 1}</th>
            <td>{route.code}</td>
            <td>{route.departureCityName}</td>
            <td>{moment(route.departureDate).format('ddd, MMM DD YYYY, HH:mm')}</td>
            <td>{route.arrivalCityName}</td>
            <td>{moment(route.arrivalDate).format('ddd, MMM DD YYYY, HH:mm')}</td>
            <td>{<NumberFormat value={route.totalAmount} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</td>

            <td>{route.ticketQuantity}</td>
            {/* <td>{getBadge(route.status)}</td> */}
            <td>
                <Link to={routeLink}>
                    <Button color="success" className="mr-2">
                        <i className="fa fa-edit fa-lg mr-1"></i>Details
                    </Button>
                </Link>
            </td>
        </tr>


    )
}

class BoughtRoutes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userRole: '',
            boughtRoutes: [],
            liabilityRoutes: [],
            liabilityCurrentPage: 1,
            boughtCurrentPage: 1,
            pageSize: 5,
            liabilityPageCount: 1,
            boughtPageCount: 1,
            liabilitySearchValue: '',
            boughtSearchValue: ''
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.getBoughtRoutes();
        this.getLiabilityRoutes();
    }

    getBoughtRoutes = () => {
        var { boughtSearchValue, liabilityCurrentPage, pageSize } = this.state
        Axios.get('api/route/bought?param=' + boughtSearchValue + '&page=' + liabilityCurrentPage + '&pageSize=' + pageSize).then(res => {
            if (res.status === 200) {
                this.setState({
                    boughtRoutes: res.data.data,
                    boughtPageCount: res.data.total <= pageSize ? 1 : res.data.total % pageSize === 0 ? parseInt(res.data.total / pageSize) : parseInt(res.data.total / pageSize) + 1
                })
            }
        })
    }

    getLiabilityRoutes = () => {
        var { liabilitySearchValue, liabilityCurrentPage, pageSize } = this.state
        Axios.get('api/route/liability?param=' + liabilitySearchValue + '&page=' + liabilityCurrentPage + '&pageSize=' + pageSize).then(res => {
            if (res.status === 200) {
                this.setState({
                    liabilityRoutes: res.data.data,
                    liabilityPageCount: res.data.total <= pageSize ? 1 : res.data.total % pageSize === 0 ? parseInt(res.data.total / pageSize) : parseInt(res.data.total / pageSize) + 1
                })
            }
        })
    }

    onChange = (event) => {
        var { name, value } = event.target;
        this.setState({
            [name]: value
        })
    }

    onBoughtSearch =(event) => {
        event.preventDefault();
        this.setState({
            boughtCurrentPage: 1
        }, () => {
            this.getBoughtRoutes()
        })
    }

    onLiabilitySearch = (event) => {
        event.preventDefault();
        this.setState({
            liabilityCurrentPage: 1
        }, () => {
            this.getLiabilityRoutes()
        })
    }

    liabilityGoPage = (pageNumber) => {
        this.setState({
            liabilityCurrentPage: pageNumber === 'prev' ? this.state.liabilityCurrentPage - 1 :
                pageNumber === 'next' ? this.state.liabilityCurrentPage + 1 :
                    pageNumber
        }, () => {
            this.getLiabilityRoutes();
        })
    }

    boughtGoPage = (pageNumber) => {
        this.setState({
            boughtCurrentPage: pageNumber === 'prev' ? this.state.boughtCurrentPage - 1 :
                pageNumber === 'next' ? this.state.boughtCurrentPage + 1 :
                    pageNumber
        }, () => {
            this.getBoughtRoutes();
        })
    }

    render() {
        var { liabilityRoutes, boughtRoutes, liabilityCurrentPage, liabilityPageCount, boughtCurrentPage, boughtPageCount } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                <strong>Bought Routes</strong>
                                <Form className="text-right mr-2" onSubmit={this.onBoughtSearch}>
                                    <InputGroup>
                                        <Input type="text" className="mr-2" placeholder="Route Code" name="boughtSearchValue" value={this.state.boughtSearchValue} onChange={this.onChange} />
                                        <Button color="primary">
                                            <i className="fa fa-search fa-lg mr-1"></i>Search Route
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
                                            <th>Total Amount</th>
                                            <th>Ticket Quantity</th>
                                            {/* <th>Status</th> */}
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {boughtRoutes.map((route, index) => (
                                            <RouteRow key={index} route={route} index={index} parent={this} />
                                        ))}
                                    </tbody>
                                </Table>
                                <div style={{ float: 'right' }}>
                                    <PaginationView currentPage={boughtCurrentPage} pageCount={boughtPageCount} goPage={this.boughtGoPage} />
                                </div>
                                
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                <strong>Liability Routes</strong>
                                <Form className="text-right mr-2" onSubmit={this.onLiabilitySearch}>
                                    <InputGroup>
                                        <Input type="text" className="mr-2" placeholder="Route Code" name="liabilitySearchValue" value={this.state.liabilitySearchValue} onChange={this.onChange} />
                                        <Button color="primary">
                                            <i className="fa fa-search fa-lg mr-1"></i>Search Route
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
                                            <th>Total Amount</th>
                                            <th>Ticket Quantity</th>
                                            {/* <th>Status</th> */}
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {liabilityRoutes.map((route, index) => (
                                            <RouteRow key={index} route={route} index={index} parent={this} />
                                        ))}
                                    </tbody>
                                </Table>
                                <div style={{ float: 'right' }}>
                                    <PaginationView currentPage={liabilityCurrentPage} pageCount={liabilityPageCount} goPage={this.liabilityGoPage} />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>


            </div>
        )
    }
}

export default BoughtRoutes;