import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import axios from 'axios';

import '../lib/bootstrap/css/bootstrap.min.css';
import '../lib/ionicons/css/ionicons.min.css';
import Template from './Template';

export default class GameCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permission: this.props.user.permission
    }
  }

  componentDidMount() {
    this.verifyPermission();
  }

  verifyPermission = () => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      this.props.history.push('/home');
    }
    else {
      var jwtDecode = require('jwt-decode');

      var decoded = jwtDecode(jwt);
      console.log("JWT DECODED: ", decoded);

      this.setState({ permission: decoded.user_claims }); 
    }
  }

  render() {
    return (
        <div>
            <Template permission={this.state.permission}/>
            <div className="videoBorder" />

            <Row>
                <Col style={{display: "flex", justifyContent: "center"}}>
                    <Button className="gameCodeBtn">
                        Generate Code 
                    </Button>
                </Col>
            </Row>

            <div className="videoBorder" />
        </div>
    );
  }
}
