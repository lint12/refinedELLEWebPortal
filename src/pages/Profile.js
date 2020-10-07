import React from 'react';
import { Container } from 'reactstrap';
import {Tabs, Tab} from 'react-bootstrap';
import axios from 'axios';
import Template from './Template';
import { Pie, Bar, HorizontalBar } from 'react-chartjs-2'; 
import SuperAdminView from '../components/Profile/SuperAdminView';
import AdminView from '../components/Profile/AdminView';
import StudentView from '../components/Profile/StudentView';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        userID: this.props.user.userID,
        username: this.props.user.username,
        permission: this.props.user.permission,

        sessions: [],
        bestModule: "", 
        moduleAverageScores: [],
        mostFrequentPlatform: "", 
        platformFrequency: [], 
        mostUtilizedPlatform: "",
        platformUtilization: [],
        displayChart: 0, 
        emptySession: false,  
    };

    this.change = this.change.bind(this);
  }

  componentDidMount() {
    this.getUserInfo(); 
  }

  getUserInfo = () => {
    axios.get(this.props.serviceIP + '/user', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }).then(async res => {
        console.log(res.data);

        this.setState({
          userID: res.data.id,
          username: res.data.username,
          permission: res.data.permissionGroup
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

  render() { 
    return (
      <Container>
      <Template/>
		  <br></br>
        {this.state.permission === "su" ? 
        <SuperAdminView 
          serviceIP={this.props.serviceIP} 
          username={this.state.username}
          permission={this.state.permission}
        /> : null}
        {this.state.permission === "pf" ? 
        <AdminView 
          serviceIP={this.props.serviceIP} 
          username={this.state.username}
          permission={this.state.permission}
        /> : null}
        {this.state.permission === "st" ? 
        <StudentView 
          serviceIP={this.props.serviceIP} 
          username={this.state.username}
          permission={this.state.permission}
        /> : null}
      <br/>
      </Container>
    );
  }
/*
              <Row>
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
*/
}
