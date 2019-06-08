import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Form, Input, InputGroup, Row, Table } from 'reactstrap';
import Axios from 'axios';

function StationRow(props) {
  const station = props.station
  const stationLink = `/station/${station.id}`

  return (
      <tr>
          <th>{props.index + 1}</th>
          <td>{station.name}</td>
          <td>{station.cityName}</td>
          <td>
              <Link to={stationLink}>
                  <Button color="danger" className="mr-2">
                      <i className="fa fa-edit fa-lg mr-1"></i>Edit
                  </Button>
              </Link>
          </td>
      </tr>


  )
}

class StationsComponent extends Component {
  constructor(props) {
      super(props);
      this.state = {
          stations: [],
          isLogin: false,
          userRole: '',
          searchParam : '',
      }
      this.onSearch = this.onSearch.bind(this);
      this.onChange = this.onChange.bind(this);
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
              this.getStations();
              this.setState({
                  userRole: userRole
              })
          }
      }

  }

  getStations = () => {
      Axios.get('api/station').then(res => {
          this.setState({
              stations: res.data
          })
      })
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
      Axios.get('api/station?param=' + this.state.searchParam).then(res => {
          console.log(res)
          this.setState({
              stations : res.data
          })
      });
  }

  render() {
      var { stations } = this.state;
      return (
          <div className="animated fadeIn">
              <Row>
                  <Col xl={12}>
                      <Card>
                          <CardHeader>
                              <Link to='/station/add'>
                                    <Button className="text-right" color="primary">
                                        <i className="fa fa-plus fa-lg mr-1"></i>Create Station
                                    </Button>
                              </Link>
                              <Form className="text-right mr-2" onSubmit={this.onSearch}>
                                  <InputGroup>
                                      <Input type="text" className="mr-2" placeholder="Stationname"
                                      value={this.state.searchParam} name="searchParam" onChange={this.onChange}/>
                                      <Button color="primary">
                                          <i className="fa fa-search fa-lg mr-1"></i>Search Station
                                      </Button>
                                  </InputGroup>
                              </Form>
                          </CardHeader>
                          <CardBody>
                              <Table responsive hover>
                                  <thead>
                                      <tr>
                                          <th>No.</th>
                                          <th>Station Name</th>
                                          <th>City Name</th>
                                          <th>Action</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {stations.map((station, index) =>
                                          <StationRow key={index} station={station} index={index} />
                                      )}
                                  </tbody>
                              </Table>
                          </CardBody>
                      </Card>
                  </Col>
              </Row>
          </div>
      )
  }
}

export default StationsComponent;
