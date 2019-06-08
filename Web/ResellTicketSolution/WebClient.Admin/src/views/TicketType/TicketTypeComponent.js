import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Form, Input, InputGroup, Row, Table,
    Pagination, PaginationItem, PaginationLink, } from 'reactstrap';
import {getTicketTypeRequest} from './../../action/TicketTypeAction';



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
                    <Button color="danger">
                        <i className="fa fa-edit fa-lg mr-1"></i>Edit
                    </Button>
                </Link>
            </td>
        </tr>


    )
}


class TicketTypeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            userRole: ''
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
            this.props.getTicketTypes(token);
        }
        this.setState({
            userRole: userRole
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
        this.props.getTicketTypesByName(this.state.searchValue);
    }

    render() {
        const { ticketTypes } = this.props;
        var { searchValue, userRole } = this.state;
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
                                                <TicketTypeRow key={index} tickettype={tickettype} index={index} />
                                            )}
                                        </tbody>
                                    </Table>
                                    <Pagination>
                                        <PaginationItem disabled><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                                        <PaginationItem active>
                                            <PaginationLink tag="button">1</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                                        <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                                        <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                                        <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                                    </Pagination>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div> : ''
        );
    };
} 

const mapStateToProps = state => {
    return {
        ticketTypes: state.ticketTypes
    }
}

const mapDispatchToProps = (dispatch, props)=>{
    return {
        getTicketTypes: () => {
            dispatch(getTicketTypeRequest());
        },
        getTicketTypesByName: (param) => {
            dispatch(getTicketTypeRequest(param));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketTypeComponent);