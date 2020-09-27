import React, { Component } from 'react';
import { Container, Row, Col, Button, Card, Form, FormGroup, Label, Input, CustomInput } from 'reactstrap';
import axios from 'axios';

import '../lib/bootstrap/css/bootstrap.min.css';
import '../lib/ionicons/css/ionicons.min.css';
import Template from './Template';
import Loading from '../components/Loading/Loading';
import PlatformSession from '../components/Sessions/PlatformSession';
import Downloads from '../components/Sessions/Downloads';

export default class Sessions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      platform: "",
      userID: "",
      moduleID: "",
      sessions: [],
      LoggedAnswers: [],
      loading: false,
      searched: false,
    }
  }

  componentDidMount() {
  }

  handleChange = (e) => {
    this.setState({ [e.target.name] : e.target.id });
  }

  handleInput = (e) => {
    this.setState({ [e.target.name] : e.target.value });
  }

  handleSearch = (e) => {
    this.setState({ 
      loading: true,
    });

    this.searchSession(); 
  }

  searchSession = () => {
    let header = {
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
      params: {
        moduleID: this.state.moduleID.length !== 0 ? parseInt(this.state.moduleID) : null, 
        userID: this.state.userID.length !== 0 ? parseInt(this.state.userID) : null, 
        platform: this.state.platform.length !== 0 ? this.state.platform : null
      }  
    };

    axios.get(this.props.serviceIP + '/searchsessions', header)
    .then(res => {
      console.log(res.data);

      this.setState(()=>{
        window.setTimeout(()=>{
          this.setState({ 
            sessions : res.data,  
            loading: false, 
            searched: true
          })
        },1000)
      });

    }).catch(function (error) {
      console.log(error);
    });
  }

  render() {
    console.log("options: ", this.state.platform)
    console.log("user ID: ", this.state.userID)
    console.log("module ID: ", this.state.moduleID)
    return (
      <Container>
      <Template/>
      <br /><br />
      <Row>
        <Col>
          <h3>Your ELLE Sessions:</h3>
        </Col>
        {localStorage.getItem('per') === "su" ? <Downloads serviceIP={this.props.serviceIP}/> : null}
      </Row>

      <br />

      <Row className="Seperated Col">
        <Col className="Left Column" xs="4">
          <Row>
            <Col>
              <Card style={{padding: "20px"}}>
                <Form>
                  <FormGroup>
                    <Label for="platform">Platform</Label>
                    <div style={{display: "flex", justifyContent: "center"}}>
                      <CustomInput type="radio" id="mb" name="platform" inline onChange={e => this.handleChange(e)}>
                        <img style={{width: "20px", height: "20px", marginRight: "5px"}} src={require('../Images/phoneGames.png')} alt="phone icon" />
                        Mobile
                      </CustomInput>
                      <CustomInput type="radio" id="cp" name="platform" inline onChange={e => this.handleChange(e)}>
                        <img style={{width: "20px", height: "20px", marginRight: "5px"}} src={require('../Images/computerGames.png')} alt="computer icon" />
                        PC
                      </CustomInput>                    
                      <CustomInput type="radio" id="vr" name="platform" inline onChange={e => this.handleChange(e)}>
                        <img style={{width: "20px", height: "20px", marginRight: "5px"}} src={require('../Images/vrGames.png')} alt="vr icon" />
                        VR
                      </CustomInput>
                    </div>
                  </FormGroup>
                  {localStorage.getItem("per") !== "st" ?
                    <FormGroup>
                      <Label for="userID">User ID</Label>
                      <Input
                        type="text"
                        name="userID"
                        onChange={e => this.handleInput(e)}
                      />
                    </FormGroup>
                  : null}
                  <FormGroup>
                    <Label for="moduleID">Module ID</Label>
                    <Input
                      type="text"
                      name="moduleID"
                      onChange={e => this.handleInput(e)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="date">Date</Label>
                    <Input
                      type="date"
                      name="date"
                    />
                  </FormGroup>
                  <Button block style={{backgroundColor: "#37f0f9", color: "black", border: "none", fontWeight: "500"}} 
                    disabled={this.state.platform.length === 0 && this.state.userID.length === 0 && this.state.moduleID.length === 0 
                      ? true : false}
                    onClick={() => this.handleSearch()}>
                    Search
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col className="Right Column">
          <Row>
            <Col>
              <Container>
                {!this.state.searched && this.state.loading === false ?
                  <Card style={{paddingBottom: "52%"}}>
                    <div>
                      <h3 style={{textAlign: 'center'}}>Please search for a session on the left.</h3>
                    </div>
                  </Card>
                : null} 

                {this.state.searched && this.state.sessions.length !== 0 && this.state.loading === false ? 
                  <PlatformSession sessions={this.state.sessions} /> 
                : null}

                {this.state.searched && this.state.sessions.length === 0 && this.state.loading === false ? 
                  <Card style={{paddingBottom: "46%"}}>
                    <div>
                      <h3 style={{textAlign: 'center'}}>No matching sessions could be found.</h3>
                      <h3 style={{textAlign: 'center'}}>Please search for another session on the left.</h3>
                    </div>
                  </Card>
                : null}

                {this.state.loading === true ? <Loading /> : null}
              </Container>
            </Col>
          </Row>
        </Col>
      </Row>
      </Container>
    );
  }
}
