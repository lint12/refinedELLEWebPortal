import React, { Component } from 'react';
import { Container, Table, Row, Col, Input, Button, InputGroup, InputGroupAddon, Modal, ModalHeader, ModalBody } from 'reactstrap';
import ListGroup from 'react-bootstrap/ListGroup'
import Tab from 'react-bootstrap/Tab'
import Select from 'react-select';
import axios from 'axios';
import '../stylesheets/style.css';

import Template from './Template';
import AccessDenied from './AccessDenied'; 

class ClassRoster extends Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount() {

  }

  change(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  updateSearch(e) {
    //this.setState({ search: e.target.value.substr(0,20) });
  }

  getUser = () => {

  }

  render() {
    if (localStorage.getItem('per') === "su" || localStorage.getItem('per') === "st") {
      return (
        <Container>
          <Template/>
          <br></br>
          <AccessDenied message={localStorage.getItem('per') === "su" ? "Information Not Valid" : "Access Denied :("} />
        </Container>
      )
    }
    return (
      <Container className="user-list">
        <Template/>
        <br></br><br></br>			
        <div>
        <h3>Class Roster</h3>
          <Tab.Container id="userList" defaultActiveKey="#students" >
            <Row>
              <Col sm={4}>
                <ListGroup className="userListTabs">
                  <ListGroup.Item action href="#students">
                    Students
                  </ListGroup.Item>
                  <ListGroup.Item action href="#tas">
                    TAs
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col sm={8}>
                <Tab.Content>
                  <Tab.Pane eventKey="#students">

                  </Tab.Pane>
                  <Tab.Pane eventKey="#tas">

                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      </Container>
    )
  }
}

export default ClassRoster
