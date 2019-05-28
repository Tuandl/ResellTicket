import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import Axios from 'axios';

class UserManagement extends Component {

  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };
  }

  getCustomers() {
    Axios.get('user').then((response) => {
      console.log(response);
      this.setState({
        users: response.data,
      });
    })
      .finally((data) => {
        console.log('finally');
      });
  }

  componentDidMount() {
    this.getCustomers();
  }

  renderUserRow(users) {
    var result = null;

    if(users.length > 0) {
      result = users.map((user, index) => {
        return (
          <tr key={index}>
            <td>{user.userName}</td>
            <td>{user.fullName}</td>
            <td>{user.email}</td>
            <td>{user.phoneNumber}</td>
            <td></td>
          </tr>
        );
      });  
    }
    
    return result;
  }

  render() {
    // var userRow = this.renderUserRow();
    var { users } = this.state;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> User
              </CardHeader>
              <CardBody>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Username</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Phone Number</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.renderUserRow(users)}
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
      </div>
    );
  }
}

export default UserManagement;
