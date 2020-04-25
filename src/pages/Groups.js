import React from 'react';
import { Button, Card, Form, FormGroup,
  Label, Input, Container, Row, Col, TabContent,
  TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import axios from 'axios';
import classnames from 'classnames';
import { Route } from 'react-router-dom';

import GroupUsers from '../components/Groups/GroupUsers';
import GroupSessions from '../components/Groups/GroupSessions';
import GroupNav from '../components/Groups/GroupNav';

export default class Groups extends React.Component {
  constructor() {
    super();
    this.change = this.change.bind(this);
    this.submitGroup = this.submitGroup.bind(this);
    this.toggle = this.toggle.bind(this);

    this.state = {
      activeTab: '1',
      groupName: '',
      groups: [],

      decks: [],

      group_user: [],

      user: []
    };
  }
  componentDidMount() {
      axios.get(this.props.serviceIP + '/groups', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
      }).then(res => {
          console.log(res.data);
          this.setState({
            groups : res.data });
        }).catch(function (error) {
          console.log(error);
        });
    }

  submitGroup(e) {
    e.preventDefault();
    axios.post(this.props.serviceIP + '/group', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
      groupName: this.state.groupName,
    }).then(res => {
      console.log(res.data);
    }).catch(function (error) {
      console.log(error);
    });
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  change(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    const matchPath = this.props.match.path;
    return (
      <Container>
        <Row><h3>Your Elle VR Decks:</h3></Row>
        <Row className="Seperated Col">
        <Col className="Left Column" xs="3">
          <Row>
            <Col>
                <Card>
                    <GroupNav
                      groups={this.state.groups}
                      groupsPathname={matchPath}
                    />
                    <Form onSubmit={e => this.submitGroup(e)}>
                      <FormGroup>
                        <Label for="groupName">Deck Name</Label>
                        <Input type="text"
                        onChange={e => this.change(e)}
                        value={this.state.groupName}
                        name="groupName"
                        id="groupName"
                        placeholder="Group Name" />
                      </FormGroup>
                      <Button color="primary" type="submit">Add Group</Button>
                    </Form>
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
                          <h3>Please select a Group on the left</h3>
                        </div>
                      )} />
                      <Route
                        path={`${matchPath}/:id`}
                        render={({ match }) => {
                          return (
                            <Container>
                            <div>
                              <Nav tabs>
                                <NavItem>
                                  <NavLink
                                    className={classnames({ active: this.state.activeTab === '1' })}
                                    onClick={() => { this.toggle('1'); }}
                                  >
                                    Users
                                  </NavLink>
                                </NavItem>
                                <NavItem>
                                  <NavLink
                                    className={classnames({ active: this.state.activeTab === '2' })}
                                    onClick={() => { this.toggle('2'); }}
                                  >
                                    Sessions
                                  </NavLink>
                                </NavItem>
                              </Nav>
                              <TabContent activeTab={this.state.activeTab}>
                                <TabPane tabId="1">
                                  <GroupUsers
                                    id={match.params.groupID}
                                    groupPathname={matchPath}
                                  />
                                </TabPane>
                                <TabPane tabId="2">
                                  <GroupSessions
                                    id={match.params.groupID}
                                    groupPathname={matchPath}
                                  />
                                </TabPane>
                              </TabContent>
                              </div>
                            </Container>
                          );
                        }}
                      />
                    </Card>
              </Container>
            </Col>
          </Row>
        </Col>
        </Row>
      </Container>
    )
  }
}
