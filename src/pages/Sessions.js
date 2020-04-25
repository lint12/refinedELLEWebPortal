import React, { Component } from 'react';
import { Card, Container, Row, Col, } from 'reactstrap';
import { Route } from 'react-router-dom';
import axios from 'axios';

import SessionNav from '../components/Sessions/SessionNav';
import Rounds from '../components/Sessions/Rounds';
import '../lib/bootstrap/css/bootstrap.min.css';
import '../lib/ionicons/css/ionicons.min.css';
import Template from './Template';

export default class Sessions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      sessions: [],
      LoggedAnswers: []
    }
  }

  componentDidMount() {
    axios.get(this.props.serviceIP + '/session', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }).then(res => {
    console.log(res.data);
      this.setState({
      sessions : res.data });
    }).catch(function (error) {
      console.log(error);
    });
  }

  render() {
    const matchPath = this.props.match.path;
    return (
    <Container>
    <Template/>
    <br></br><br></br>
    <h3>Your ELLE Sessions:</h3>
    <Row className="Seperated Col">
      <Col className="Left Column" xs="3">
        <Row>
          <Col>
            <Card>
              <SessionNav sessions={this.state.sessions} sessionsPathname={matchPath}/>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col className="Right Column">
        <Row>
          <Col>
            <Container>
              <Card>
                <Route exact path={matchPath} render={() => (
                  <div>
                    <h3 style={{textAlign: 'center'}}>Please select a session from the left.</h3>
                  </div>
                  )} />
                <Route path={`${matchPath}/:sessionID`} render={({ match }) => {
                  const session = this.state.sessions.find((a)=>
                    a.id === match.params.sessionID
                  );
                  return (
                    <Rounds session={session}/>
                  );
                }}/>
              </Card>
            </Container>
          </Col>
        </Row>
      </Col>
    </Row>
    </Container>
    );
  }
}
