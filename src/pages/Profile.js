import React from 'react';
import { Button, Form, FormGroup, FormFeedback, Label, Input, InputGroupAddon, Container, Row, 
  Col, Card, CardSubtitle, CardBody, Badge, Alert, Tooltip, Modal, ModalHeader, ModalBody, ModalFooter, 
  ListGroup, ListGroupItem, InputGroup } from 'reactstrap';
import {Tabs, Tab} from 'react-bootstrap';
import axios from 'axios';
import Template from './Template';
import { Pie, Bar, HorizontalBar } from 'react-chartjs-2'; 
import SuperAdminProfile from './SuperAdminProfile';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        userID: "",
        username: "",
        newPassword: "",
        confirmPassword: "",
        validConfirm: false,
        invalidConfirm: false, 
        hiddenPassword: true,
        hiddenConfirm: true, 
        classes: [],
        currentClassDetails: {},
        className: "", 
        classCode: "", 
        sessions: [],
        bestModule: "", 
        moduleAverageScores: [],
        mostFrequentPlatform: "", 
        platformFrequency: [], 
        mostUtilizedPlatform: "",
        platformUtilization: [],
        displayChart: 0, 
        emptySession: false,  
        tooltipOpen: false,
        pwModal: false, 
        classDetailModalOpen: false
    };

    this.change = this.change.bind(this);
    this.submitPassword= this.submitPassword.bind(this);
  }

  componentDidMount() {
    this.getUserInfo(); 
    this.getClasses(); 
  }

  getUserInfo = () => {
    axios.get(this.props.serviceIP + '/user', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }).then(async res => {
        console.log(res.data);

        this.setState({
          userID: res.data.id,
          username: res.data.username,
        });
        console.log("ID: ", res.data.id) //14,26,9,51,52,47 //51 needs fixing //need to fix issue that the bar charts wont start at zero
        await axios.get(this.props.serviceIP + '/searchsessions', {params: {userID: res.data.id},
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
        }).then(res => {
          console.log(res.data);
          
          //make a check for res.data if its empty 
          this.setState({
            sessions: res.data
          })
 
          // this.findNeedImprovementModule(res.data); 
          // this.findModuleAvgScore(res.data);
          // this.findMostFrequentPlatform(res.data); 
          // this.findPlatformUtilization(res.data); 

        }).catch(function (error) {
          console.log(error);
        });

    }).catch(function (error) {
      console.log(error);
    });
  }

  getClasses = () => {
    axios.get(this.props.serviceIP + '/searchusergroups', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }).then(res => {
      console.log(res.data); 
      this.setState({ classes: res.data })
    }).catch(error => {
      console.log(error.response); 
    })
  }

  //this is for the word/term of the day 
  findNeedImprovementModule = (data) => {
    let greaterThanZeroSessions = data.filter((session) => session.playerScore > 0); 
    if (greaterThanZeroSessions.length !== 0) {
      let needImprovementModule = greaterThanZeroSessions.reduce((curMin, curVal) => (curMin.playerScore < curVal.playerScore) ? curMin : curVal, Number.MAX_VALUE);
      console.log("> 0", greaterThanZeroSessions); 
      console.log("NEEDS IMPROVEMENT: ", needImprovementModule); 

      axios.get(this.props.serviceIP + '/session', {params: {sessionID: needImprovementModule.sessionID},
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
      }).then(res => {
        console.log(res.data);
      }).catch(function (error) {
        console.log(error);
      });
    } 
    //need to add else if they dont have any sessions what should the word of the day be? 
  }

  findModuleAvgScore = (data) => {
    let sessions = data.filter(session => session.playerScore !== null); 
    if (sessions.length === 0) {
      this.setState({ emptySession: true }); 
    }
    else {
      let moduleScores = new Map(); 
      let moduleAverageScores = []; 
      let avg; 

      for (let i = 0; i < sessions.length; i++) {
        if (moduleScores.has(sessions[i].moduleID) === false) {
          moduleScores.set(sessions[i].moduleID, {
            name: sessions[i].moduleName, 
            cnt: 1, 
            totalScore: sessions[i].playerScore});
        }
        else {
          moduleScores.set(sessions[i].moduleID, {
            name: sessions[i].moduleName, 
            cnt: moduleScores.get(sessions[i].moduleID).cnt + 1, 
            totalScore: moduleScores.get(sessions[i].moduleID).totalScore + sessions[i].playerScore});
        }
      }

      for (let value of moduleScores.values()){
        avg = ((value.totalScore/100) / value.cnt) * 100 

        moduleAverageScores.push({
          name: value.name,
          average: avg
        })
      }

      let bestModule = moduleAverageScores.reduce((curMax, curVal) => (curMax.average > curVal.average) ? curMax : curVal, 0);

      this.setState({
        bestModule: bestModule, 
        moduleAverageScores: moduleAverageScores
      })
    }
  }
//should i include data of when there's no playerscore recorded? 
  findMostFrequentPlatform = (data) => {
    let sessions = data.filter(session => session.playerScore !== null); 
    if (sessions.length === 0) {
      this.setState({ emptySession: true }); 
    }
    else {
      let mobile = data.filter((session) => session.platform === "mb");
      let pc = data.filter((session) => session.platform === "cp"); 
      let vr = data.filter((session) => session.platform === "vr"); 

      let platforms = []; 
      platforms.push({platform: "Mobile", size: mobile.length});
      platforms.push({platform: "PC", size: pc.length});
      platforms.push({platform: "VR", size: vr.length});

      let mostFrequent = platforms.reduce((curMax, curVal) => (curMax.size > curVal.size) ? curMax : curVal, 0); 
      this.setState({
        mostFrequentPlatform: mostFrequent.platform, 
        platformFrequency: platforms
      })
    }
  }

  convertTimetoDecimal = (time) => {
    let hoursMinutes = time.split(/[.:]/);
    let hours = parseInt(hoursMinutes[0], 10);
    let minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes / 60;
  }

  findPlatformUtilization = (data) => {
    let sessions = data.filter(session => session.playerScore !== null); 
    if (sessions.length === 0) {
      this.setState({ emptySession: true }); 
    }
    else {
      let mobile = data.filter((session) => session.platform === "mb" && session.endTime !== null);
      let pc = data.filter((session) => session.platform === "cp" && session.endTime !== null); 
      let vr = data.filter((session) => session.platform === "vr" && session.endTime !== null); 

      let mobileDuration = mobile.map((session) => {return this.convertTimetoDecimal(session.endTime) - this.convertTimetoDecimal(session.startTime)}); 
      let pcDuration = pc.map((session) => {return this.convertTimetoDecimal(session.endTime) - this.convertTimetoDecimal(session.startTime)}); 
      let vrDuration = vr.map((session) => {return this.convertTimetoDecimal(session.endTime) - this.convertTimetoDecimal(session.startTime)}); 

      let mobileAvgDur = mobileDuration.length ? (mobileDuration.reduce((acc, session) => {return acc + session}, 0)) / mobileDuration.length : 0
      let pcAvgDur = pcDuration.length ? (pcDuration.reduce((acc, session) => {return acc + session}, 0)) / pcDuration.length : 0 
      let vrAvgDur = vrDuration.length ? (vrDuration.reduce((acc, session) => {return acc + session}, 0)) / vrDuration.length : 0

      let utilization = [];
      utilization.push({name: "Mobile", duration: mobileAvgDur}); 
      utilization.push({name: "PC", duration: pcAvgDur}); 
      utilization.push({name: "VR", duration: vrAvgDur});

      let mostUtilized = utilization.reduce((curMax, curVal) => (curMax.duration > curVal.duration) ? curMax : curVal, 0); 

      this.setState({
        mostUtilizedPlatform: mostUtilized.name, 
        platformUtilization: utilization
      })
    }
  }

  renderPerformanceChart = () => {
    let possibleColors=['#abc9cd', '#658e93', '#7abe80', '#45954c', '#ffbdbd']

    let chartColors = [];
    let colorIndex = 0;

    for (let i = 0; i < this.state.moduleAverageScores.length; i++){
      chartColors.push(possibleColors[colorIndex]);
      
      colorIndex++;
      
      if(colorIndex >= possibleColors.length){
        colorIndex = 0;
      }
    }

    let performanceData = {
      labels: this.state.moduleAverageScores.map((entry) => {return entry.name}),
      datasets: [
        {
          label: 'Average Score (%)',
          data: this.state.moduleAverageScores.map((entry) => {return entry.average.toFixed(2)}),
          backgroundColor: chartColors
        }
      ]
    };
    
    return (
        <Bar 
          data={performanceData}
          options={
            { 
              scales: {
              yAxes: [{
                ticks: {                  
                  beginAtZero: true, 
                  min: 0,
                  max: 100,
                  fontColor: 'white'
                }
              }],
              xAxes: [{
                ticks: {
                  fontColor: 'white'
              }
              }]
              },
              legend: {labels: { fontColor: 'white' } }
            }     
          }
        />
    )
  }
  
  renderFrequencyChart = () => {
    let frequencyData = {
			labels: ['Mobile', 'PC', 'VR'],
			datasets: [
				{
					label: 'platforms',
					data: this.state.platformFrequency.map(platform => {return platform.size}),
					backgroundColor: ['#96384e', '#eda48e', '#eed284']
				}
			]
    };

    return (
      <Pie
        data={frequencyData}
        options={{
          legend: {
              position: 'right',
              labels: {
                  fontColor: 'white'
              }
          }
        }
      }
      />
    )
  }

  renderUtilizationChart = () => {
    let utilizationData = {
			labels: ['Mobile', 'PC', 'VR'],
			datasets: [
				{
          label: 'Avg # of hours',
					data: this.state.platformUtilization.map(platform => {return platform.duration.toFixed(2)}),
					backgroundColor: ['#30C3CD', '#E8804C', '#097275']
				}
			]
    };

    return (
      <HorizontalBar
        data={utilizationData}
        options={ { 
          scales: {
          yAxes: [{
            ticks: {
              fontColor: 'white'
            }
          }],
          xAxes: [{
            ticks: {
              beginAtZero: true, 
              min: 0,
              fontColor: 'white'
          }
          }]
          },
          legend: {labels: { fontColor: 'white' } }
        }
      }
      />
    )
  }

  toggleChartAnimation = (key) => {
    this.setState({ displayChart: Number(key) }) 
  }

  change(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  toggleTooltipOpen = () => {
    this.setState({ tooltipOpen: !this.state.tooltipOpen })
  }
  
  validatePassword = (e) => {
    let id = e.target.name === "newPassword" ? 0 : 1; 

    this.setState({
      [e.target.name]: e.target.value
    })

    if (id === 0) {
      if ((e.target.value.length === 0 && this.state.confirmPassword.length === 0)|| 
        (e.target.value.length > 0 && this.state.confirmPassword.length === 0)) {
        this.setState({
          validConfirm: false, 
          invalidConfirm: false
        })
      }
      else if (e.target.value.localeCompare(this.state.confirmPassword) === 0) {
        this.setState({
          validConfirm: true, 
          invalidConfirm: false
        })
      }
      else {
        this.setState({
          validConfirm: false, 
          invalidConfirm: true
        })
      }
    }
    else {
      if ((e.target.value.length === 0 && this.state.newPassword.length === 0)) {
        this.setState({
          validConfirm: false, 
          invalidConfirm: false
        })
      }
      else if (e.target.value.localeCompare(this.state.newPassword) === 0) {
        this.setState({
          validConfirm: true, 
          invalidConfirm: false
        })
      }
      else {
        this.setState({
          validConfirm: false, 
          invalidConfirm: true
        })
      }
    }
  }

  revealClassDetails = (item) => {
    console.log(item); 
    return (
      <Modal isOpen={this.state.classDetailModalOpen} toggle={this.toggleClassDetailModal}>
        <ModalHeader toggle={this.toggleClassDetailModal}>Class Details</ModalHeader>
        <ModalBody>
          <Card>
            <Row>
              <Col style={{paddingLeft: "30px"}}>
                <Label>Class Name: </Label>{' '}{item.groupName}
              </Col>
            </Row>
            <Row>
              <Col style={{paddingLeft: "30px"}}>
              <Label>Class Code: </Label>{' '}{item.groupCode}
              </Col>
            </Row>
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" >Edit</Button>{' '}
          <Button color="secondary" >Delete</Button>
        </ModalFooter>
      </Modal>
    )
  }

  toggleClassDetailModal = (item) => {
    this.setState({ 
      classDetailModalOpen: !this.state.classDetailModalOpen, 
      currentClassDetails: item
    })
  }

  submitClassCode = (e) => {
    e.preventDefault(); 
    console.log("CODE: ", this.state.classCode); 
    var data = {
      groupCode: this.state.classCode
    }

    var headers = {
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    }

    axios.post(this.props.serviceIP + '/groupregister', data, {headers:headers}
    ).then(res => {
      console.log(res.data); 
      this.getClasses(); 
      this.setState({ classCode: "" }); 
    }).catch(error => {
      console.log(error.response); 
    })
  }

  createClass = (e) => {
    e.preventDefault(); 
    console.log("Class name: ", this.state.className);
    var data = {
      groupName: this.state.className
    }

    var headers = {
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    }

    axios.post(this.props.serviceIP + '/group', data, {headers:headers}
    ).then(res => {
      console.log(res.data); 
      this.getClasses(); 

      this.setState({ className: "" }); 
    }).catch(error => {
      console.log(error.response); 
    })
  }

  submitPassword = () => {
      var data = {
        userID: this.state.userID,
        pw: this.state.newPassword,
        confirm: this.state.confirmPassword
      }
      var headers = {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }

      axios.post(this.props.serviceIP + '/resetpassword', data, {headers:headers})
      .then(res => {
        console.log(res.data);
        this.togglePwModal(); 
      }).catch(function (error) {
        console.log(error);
      });
  }

  togglePwModal = () => {
    this.setState({
      pwModal: !this.state.pwModal, 
      newPassword: "", 
      confirmPassword: "", 
      validConfirm: false, 
      invalidConfirm: false, 
    })
  }

  togglePWPrivacy = (e) => {
    console.log(e.target)
    if (e.target.name === "hiddenPassword") {
      this.setState({
        hiddenPassword: !this.state.hiddenPassword
      })
    }
    else {
      this.setState({
        hiddenConfirm: !this.state.hiddenConfirm
      })
    }
  }

  render() { 
    if (localStorage.getItem('per') === "su") {
      return (
        <SuperAdminProfile username={this.state.username} />
      )
    }
    return (
      <Container>
      <Template/>
		  <br></br>
	  
      <h3><Badge style={{backgroundColor: "cadetblue"}}>Your Profile</Badge></h3> 
      <Row>
        <Col xs="3">
          <Card style={{backgroundColor: "lightblue", height: "65vh"}}>
          <CardBody>
          <h6>Username:</h6>
          <Card>
              <Row>
                <Col xs="9" style={{paddingLeft: "35px", paddingTop: "5px"}}>
                  {this.state.username}
                </Col>
                <Col xs="3">
                  <Button id="changePassword" style={{backgroundColor: "aliceblue", float: "right"}}
                    onClick={() => this.togglePwModal()}> 
                    <img src={require('../Images/password.png')} style={{width: "15px", height: "15px"}}/>
                  </Button>
                  <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="changePassword" toggle={this.toggleTooltipOpen}>
                    Click to Change Password
                  </Tooltip>
                  <Modal isOpen={this.state.pwModal} toggle={this.togglePwModal}>
                    <ModalHeader toggle={this.togglePwModal}>Change Password</ModalHeader>
                    <Card style={{borderRadius: "0px"}}>
                      <CardBody>
                      <Form>
                        <FormGroup>
                          <Label>New Password:</Label>
                        <InputGroup>
                          <Input 
                            type={this.state.hiddenPassword ? 'password' : 'text'}
                            name="newPassword"
                            id="newPassword"
                            placeholder="Enter your new password here."
                            autoComplete="new-password"
                            onChange={e => this.validatePassword(e)}
                            value={this.state.newPassword}
                          />
                          <InputGroupAddon addonType="append">
                            <Button 
                              style={{backgroundColor: "white", border: "none"}} 
                              name="hiddenPassword"
                              onClick={e => this.togglePWPrivacy(e)}
                            >
                              <img 
                                src={require('../Images/hide.png')} 
                                alt="Icon made by Pixel perfect from www.flaticon.com" 
                                name="hiddenPassword"
                                style={{width: '24px', height: '24px'}}
                              />
                            </Button>
                          </InputGroupAddon>
                        </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <Label>Confirm Password:</Label>
                          <InputGroup>
                            <Input 
                              valid={this.state.validConfirm}
                              invalid={this.state.invalidConfirm}
                              type={this.state.hiddenConfirm ? 'password' : 'text'}
                              name="confirmPassword"
                              id="confirmPassword"
                              placeholder="Confirm your new password here."
                              autoComplete="off"
                              onChange={e => this.validatePassword(e)}
                              value={this.state.confirmPassword}
                            />
                            <InputGroupAddon addonType="append">
                              <Button 
                                style={{backgroundColor: "white", border: "none"}} 
                                name="hiddenConfirm"
                                onClick={e => this.togglePWPrivacy(e)}
                              >
                                <img 
                                  src={require('../Images/hide.png')} 
                                  alt="Icon made by Pixel perfect from www.flaticon.com" 
                                  name="hiddenConfirm"
                                  style={{width: '24px', height: '24px'}}
                                />
                              </Button>
                            </InputGroupAddon>
                            <FormFeedback valid>
                              The passwords match!
                            </FormFeedback>
                            <FormFeedback invalid={this.state.invalidConfirm.toString()}>
                              The passwords do not match, please try again.
                            </FormFeedback>
                        </InputGroup>
                        </FormGroup>
                      </Form>
                      </CardBody>
                    </Card>
                    <ModalFooter>
                      <Button disabled={this.state.validConfirm ? false : true} block onClick={() => this.submitPassword()}>
                        Submit New Password
                      </Button>
                    </ModalFooter>
                  </Modal>
                </Col>
              </Row>
          </Card>
          <br />
          <h6>Classes:</h6>
          <Card style={{overflow:"scroll", height: "20vh"}}>
            <ListGroup flush>
              {this.state.classes.length === 0 
              ? <ListGroupItem> You currently are not part of any classes. </ListGroupItem>
              : this.state.classes.map((item, i) => {
                return(
                  <ListGroupItem key={i}> 
                    {item.groupName} 
                    {localStorage.getItem('per') === "pf" 
                    ? 
                    <>
                      <Button 
                        style={{float: "right", backgroundColor: "white", border: "none", padding: "0"}}
                        onClick={() => this.toggleClassDetailModal(item)}
                      >
                        <img 
                          src={require('../Images/more.png')} 
                          alt="Icon made by xnimrodx from www.flaticon.com" 
                          name="more"
                          style={{width: '24px', height: '24px'}}
                        />
                      </Button>
                      {this.revealClassDetails(this.state.currentClassDetails)}
                    </>
                    : null}
                  </ListGroupItem>)
                })
              }
            </ListGroup>
          </Card>
          {localStorage.getItem('per') === "st" 
          ?           
          <Form onSubmit={e => this.submitClassCode(e)}>
            <h3 style={{marginTop: "8px"}}>Join a New Class</h3>
            <FormGroup>
              <Label for="classCode">Enter your class code below.</Label>
              <Input type="text"
              name="classCode"
              id="classCode"
              onChange={e => this.change(e)}
              value={this.state.classCode} />
            </FormGroup>
            <Button block type="submit">Submit Class Code</Button>
          </Form>
          : 
          <Form onSubmit={e => this.createClass(e)}>
            <h4 style={{marginTop: "8px"}}>Create a New Class</h4>
            <FormGroup>
              <Label for="className">Class Name: </Label>
              <Input type="text"
              name="className"
              id="className"
              onChange={e => this.change(e)}
              value={this.state.className} />
            </FormGroup>
            <Button block type="submit">Create</Button>
          </Form>
          }
          </CardBody>
          </Card>
        </Col>

        <Col xs="9">
          <Card style={{backgroundColor: "cadetblue", height: "65vh"}}>
            <CardBody style={{color: "#04354b"}}>
              <h1 style={{textDecoration: "underline", fontFamily: "auto"}}>
                Welcome back {this.state.username}!
              </h1>

              {/* <Row>
                <Col xs="8">
                <Tabs defaultActiveKey={0} id="uncontrolled-tab-example" className="profileTabs"
                      onSelect={(k) => this.toggleChartAnimation(k)}>
                  <Tab eventKey={0} title="Performance">
                    <Row>
                      <Col>
                        <Card style={{backgroundColor: "#04354b", color: "aqua", height: "45vh"}}>
                          <p style={{paddingLeft: "10px"}}>Best Performing Module: {this.state.bestModule.name}</p>
                          {(this.state.displayChart === 0 && this.state.moduleAverageScores.length !== 0)
                            ? this.renderPerformanceChart()
                            : this.state.emptySession ? 
                            <CardBody>
                              <Alert>
                                You currently have no valid logged sessions.
                              </Alert>
                            </CardBody> : null}
                        </Card>
                      </Col>
                    </Row>
                  </Tab>
                  <Tab eventKey={1} title="Frequency">
                  <Row>
                    <Col>
                      <Card style={{backgroundColor: "#04354b", color: "aqua", height: "45vh"}}>
                        <p style={{paddingLeft: "10px"}}>Most Frequent Platform: {this.state.mostFrequentPlatform}</p>
                        {(this.state.displayChart === 1 && this.state.platformFrequency.length !== 0)
                          ? this.renderFrequencyChart()
                          : this.state.emptySession ? 
                          <CardBody>
                            <Alert>
                              You currently have no valid logged sessions.
                            </Alert>
                          </CardBody> : null}
                      </Card>
                    </Col>
                  </Row>
                  </Tab>
                  <Tab eventKey={2} title="Utilization">
                  <Row>
                    <Col>
                      <Card style={{backgroundColor: "#04354b", color: "aqua", height: "45vh"}}>
                        <p style={{paddingLeft: "10px"}}>Most Utilized Platform: {this.state.mostUtilizedPlatform}</p>
                        {(this.state.displayChart === 2 && this.state.platformUtilization.length !== 0)
                          ? this.renderUtilizationChart()
                          : this.state.emptySession ? 
                          <CardBody>
                            <Alert>
                              You currently have no valid logged sessions.
                            </Alert>
                          </CardBody> : null}
                      </Card>
                    </Col>
                  </Row>
                  </Tab>
                </Tabs>
                </Col>
                <Col xs="4" style={{paddingTop: "40px"}}>
                  <Card style={{backgroundColor: "black", height: "20vh"}}>
                    <CardBody>
                      <CardSubtitle style={{color: "lightblue"}}>Word of the day</CardSubtitle>
                    </CardBody>
                  </Card>
                </Col>  
              </Row>
              */}
            </CardBody>
          </Card>
        </Col>
      </Row> 
		<br/>
      </Container>
    );
  }
}
