import Axios from 'axios';
import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import {Link} from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Input, Label, Row } from 'reactstrap';

class CityViewComponent extends Component {
  constructor(props) {
      super(props);
      this.state = {
          city: {
              id: '',
              name: ''
          }
      }
      // debugger;
  }

  componentWillMount() {
      var {match} = this.props;
      //console.log(match.params.id);
      this.getCityById(match.params.id);
  }

  getCityById = (id) => {
      Axios.get(`api/city/${id}`).then(res => {
          this.setState({
              city : res.data
          })
      })
  }

  handleOnChanged = (event) => {
      const {id, value} = event.target;
      this.setState({
          city : {
              ...this.state.city,
              [id] : value
          }
      })
  }

  onSaveChanges = () => {
      var {city} = this.state;
      Axios.put('api/city/', city).then(res => {
          if(res.status === 200) {
              toastr.success('Update Success', 'City has been updated successfully.');
              this.props.history.push('/city');
          } else {
              toastr.error('Error', 'Error when update City');
          }
      })
  }

  render() {
      var { city } = this.state;
      return (
          <div className="animated fadeIn">
              <Card>
                  <CardHeader>
                      <strong><i className="icon-info pr-1"></i>City Details</strong>
                  </CardHeader>
                  <CardBody>
                          <Col md="6" xs="12">
                                  <Label htmlFor="cityName">Cityname</Label>
                                  <Input type="text" id="name"
                                      placeholder="Enter Cityname..."
                                      value={city.name}
                                      onChange={this.handleOnChanged}
                                  />
                          </Col>
                      <Row className="float-right">
                          <Col xs="12">
                              <Button type="button" color="primary" onClick={this.onSaveChanges}>Save changes</Button>
                              <Link to='/city'>
                              <Button color="secondary" className="ml-1">Cancel</Button>
                              </Link>

                          </Col>
                      </Row>
                  </CardBody>
              </Card>
          </div>
      )
  }

}

export default CityViewComponent;
