import Axios from 'axios';
import React, { Component } from 'react';
// import { toastr } from 'react-redux-toastr';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Form, Input, InputGroup, Row, Table, Badge } from 'reactstrap';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import PaginationView from '../Pagination/PaginationComponent';

function RouteRow(props) {
    const { route, isDashboard } = props;
    const routeLink = isDashboard ? `/dashboard/${route.id}` : `/completedRoute/${route.id}`

    function renderEarnedLoss(earnedLoss) {
        if(earnedLoss < 0) {
            return (
                <Badge color="danger">Loss: ${earnedLoss * (-1)}</Badge>
            )
        } else {
            return (
                <Badge color="success">Earned: ${earnedLoss}</Badge>
            )
        }
    }

    return (
        <tr>
            <th>{props.index + 1}</th>
            <td>{route.code}</td>
            <td>{route.departureCityName} - {moment(route.departureDate).format('ddd, MMM DD YYYY, HH:mm')}</td>
            <td>{route.arrivalCityName} - {moment(route.arrivalDate).format('ddd, MMM DD YYYY, HH:mm')}</td>
            <td style={{paddingLeft: 95}}>{route.ticketQuantity}</td>
            <td style={{paddingLeft: 65}}>{<NumberFormat value={route.totalAmount} displayType={'text'} thousandSeparator={true} prefix={'$'} />}</td>
            <td>
                {renderEarnedLoss(route.earnedLoss)}
            </td>
            <td>
                <Link to={routeLink}>
                    <Button color="secondary" className="mr-2">
                        <i className="fa fa-edit fa-lg mr-1"></i>Details
                    </Button>
                </Link>
            </td>
        </tr>
    )
}

class CompletedRoute extends Component {

    constructor(props) {
        super(props);
        this.state = {
            routes: [],
            currentPage: 1,
            pageSize: 5,
            pageCount: 1,
            searchValue: '',
        }
    }

    componentDidMount() {
        this.getCompletedRoutes();
    }

    getCompletedRoutes = () => {
        var { searchValue, currentPage, pageSize } = this.state
        Axios.get('api/route/completed?param=' + searchValue + '&page=' + currentPage + '&pageSize=' + pageSize).then(res => {
            if (res.status === 200) {
                this.setState({
                    routes: res.data.data,
                    pageCount: res.data.total <= pageSize ? 1 : res.data.total % pageSize === 0 ? parseInt(res.data.total / pageSize) : parseInt(res.data.total / pageSize) + 1
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

    onSubmit = (event) => {
        event.preventDefault();
        this.setState({
            currentPage: 1
        }, () => {
            this.getCompletedRoutes()
        })
    }

    goPage = (pageNumber) => {
        this.setState({
            currentPage: pageNumber === 'prev' ? this.state.currentPage - 1 :
                pageNumber === 'next' ? this.state.currentPage + 1 :
                    pageNumber
        }, () => {
            this.getCompletedRoutes();
        })
    }

    render() {
        var {routes, currentPage, pageCount} = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                <strong>Completed Routes</strong>
                                <Form className="text-right mr-2" onSubmit={this.onSubmit}>
                                    <InputGroup>
                                        <Input type="text" className="mr-2" placeholder="Route Code" name="searchValue" value={this.state.searchValue} onChange={this.onChange} />
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
                                            <th>Arrival</th>
                                            <th>Ticket Quantity</th>
                                            <th>Total Amount</th>
                                            <th>Result</th>                                           
                                            {/* <th>Status</th> */}
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {routes.map((route, index) => (
                                            <RouteRow key={index} route={route} index={index} parent={this} isDashboard={this.props.isDashboard}/>
                                        ))}
                                    </tbody>
                                </Table>
                                <div style={{ float: 'right' }}>
                                    <PaginationView currentPage={currentPage} pageCount={pageCount} goPage={this.goPage} />
                                </div>
                                
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default CompletedRoute;