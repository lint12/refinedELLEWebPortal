import React, { Component, Fragment } from 'react';
import { Collapse, Button, Card, CardHeader, CardBody, CardText, Input, InputGroup,
   InputGroupAddon, Container, Row, Col, Alert, ListGroup, ListGroupItem} from 'reactstrap';
import axios from 'axios';
  
import Template from './Template';
import GameChart from '../components/Stats/GameChart';
import ModuleChart from '../components/Stats/ModuleChart';

import '../stylesheets/style.css';
import '../lib/bootstrap/css/bootstrap.min.css';
import '../lib/font-awesome/css/font-awesome.min.css';
import '../lib/owlcarousel/assets/owl.carousel.min.css';
import '../lib/ionicons/css/ionicons.min.css';
import { platform } from 'chart.js';

export default class Stats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameChartData: [],

      moduleChartData: [],

      platformList: [],

      moduleList: [],

      currentModule: "",

      currentPlatform: "",

      moduleChartOpen: false,

      gameChartOpen: false, 

      isHoveringMobile: false, 
      isHoveringPC: false, 
      isHoveringVR: false, 
      displayChart: false, 
      selectedChartInfo: ""
    };
  }

  componentDidMount(){
    this.getPlatforms();
    this.getModules();
  }

  //this never gets used and should probably be deleted
  change(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  //TODO: make API call to get list of platforms, get the chart data in the .then()
  getPlatforms = () => {
    let header = {
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
    }

    axios.get(this.props.serviceIP + '/platformnames', header)
    .then(res => {
      console.log("getPlatforms res.data: ", res.data)

      this.setState({
        platformList: res.data
      })

    })
    .catch(error => {
      console.log("getPlatforms error: ", error)
    })

  }

  //TODO: make API call to get list of modules, get the chart data in the .then()
  getModules = () => {
    let header = {
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
    }

    axios.get(this.props.serviceIP + '/modules', header)
    .then(res => {
      let modules = res.data;

      console.log("getModules res.data: ", res.data);

      this.setState({
        moduleList: modules
      });
    })
    .catch( error => {
      console.log("getModules error: ", error)
    })
  }

  toggleModuleChart = () => {

    this.setState({
      moduleChartOpen: !this.state.moduleChartOpen
    })
  }

  toggleGameChart = () => {
    this.setState({
      gameChartOpen: !this.state.gameChartOpen
    })
  }


  //TODO: update this with new API calls
  getGameChartData = (platform) => {

    this.setState({
      currentPlatform: platform
    })

    let header = {
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')},
      params: {platform: platform}
      };

    axios.get(this.props.serviceIP + '/platformstats', header)
    .then(res => {
      console.log("getGameChartData res.data: ", res.data)

      this.setState({
        gameChartData: res.data
      })
    })
    .catch(error => {
      console.log("getGameChartData error: ", error)
    })

    this.toggleGameChart();
  }


  //TODO: make API call
  getModuleChartData = (moduleID, module) => {

    console.log("getModuleChartData, moduleID: ", moduleID, "module: ", module);

    this.setState({
      currentModule: module
    })

    let header = {
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')},
      params: {moduleID: moduleID}
    };

    axios.get(this.props.serviceIP + '/modulestats', header)
    .then(res => {
      console.log("getModuleChartData res.data: ", res.data);

      this.setState({
        moduleChartData: res.data
      })
    })
    .catch(error => {
      console.log("getModuleChartData error: ", error)
      })

    this.toggleModuleChart();
  }

  getModuleChartButtons = () => {
    
    let moduleButtonArray = this.state.moduleList.map(
      module => {
        return (
          
          <Button
          style={{backgroundColor: "darkBlue", borderStyle: "red", margin: "3px"}}
            key={module.moduleID}
            onClick={() => this.getModuleChartData(module.moduleID, module.name)}
          >
            {module.name}
          </Button>
          )
      }
    );

    return moduleButtonArray;
  }

  getPlatformName = (platform) => {
    if(platform == "cp"){
              return "PC"
            }else if (platform === "mb"){
              return "Mobile"
            }else{
              return platform
            }
  }
  getGameChartButtons = () => {
    console.log("getGameChartButtons this.state.platformList: ", this.state.platformList)
    let gameButtonArray = this.state.platformList.map(
      platform => {
        return (
          <Button
            style={{backgroundColor: "darkBlue", borderStyle: "red", margin: "3px"}}
            key={platform}
            onClick={() => this.getGameChartData(platform)}
          >
            {this.getPlatformName(platform)}
          </Button>
          )
      }
    )

    return gameButtonArray;
  }


  renderModuleChart = () => {

    console.log("in renderModuleChart, this.state.moduleChartData: ", this.state.moduleChartData, "this.state.currentModule: ", this.state.currentModule)
    return(<ModuleChart
          moduleName={this.state.currentModule}
          chartData={this.state.moduleChartData}
          />)
  }

  renderGameChart = () => {
    return(<GameChart
            platform={this.state.currentPlatform}
            chartData={this.state.gameChartData}
            />)
  }

  renderLanguageList = () => {
    //needs API call to retrieve # of languages 
    return (
      <Card style={{overflow:"scroll", height: "20vh"}}>
        <ListGroup flush>
          <ListGroupItem disabled style={{backgroundColor: "grey", color: "white"}}>Total # of Languages: </ListGroupItem>
          <ListGroupItem style={{color: "black"}}>Spanish</ListGroupItem>
          <ListGroupItem style={{color: "black"}}>Portugese</ListGroupItem>
          <ListGroupItem style={{color: "black"}}>German</ListGroupItem>
          <ListGroupItem style={{color: "black"}}>French</ListGroupItem>
        </ListGroup>
      </Card>
    )
  }

  platformContainer(props) {
    if (props.platform === 0 || props.platform === 1) {
      return (
        <Container style={{paddingTop: "80px"}}>
          <CardText>
            <Button block style={{backgroundColor: "#1fbfb8",borderRadius: "20px"}}
              onClick={() => props.toggleChart(props.platform, "playtime")}>
              Average Playtime
            </Button>
            <Button block style={{backgroundColor: "#1fbfb8", borderRadius: "20px"}}>Average Utilization</Button>
            <Button block style={{backgroundColor: "#1fbfb8", borderRadius: "20px"}}>Average Score</Button>
          </CardText>
        </Container>
      )
    }
    else {
      return (
        <Container style={{paddingTop: "60px"}}>
          <CardText>
            <Button block style={{backgroundColor: "#1fbfb8",borderRadius: "20px"}}>Average Playtime</Button>
            <Button block style={{backgroundColor: "#1fbfb8", borderRadius: "20px"}}>Average Utilization</Button>
            <Button block style={{backgroundColor: "#1fbfb8", borderRadius: "20px"}}>Average Score</Button>
            <Button block style={{backgroundColor: "#1fbfb8", borderRadius: "20px"}}>Most Interacted Item</Button>
          </CardText>
        </Container>
      )
    } 
  }

  handleMouseHover(platform) {
    if (platform === 0) 
      this.setState({ isHoveringMobile: !this.state.isHoveringMobile });
    else if (platform === 1)
      this.setState({ isHoveringPC: !this.state.isHoveringPC });
    else 
      this.setState({ isHoveringVR: !this.state.isHoveringVR });
  }

  toggleChart = (platform, info) => {
    console.log("in toggleChart: ", platform, " ", info); 
    this.setState({
      displayChart : !this.state.displayChart, 
      currentPlatform: platform, 
      selectedChartInfo: info
    }); 
  }

  render() {
    // let chart; 
    // if (this.currentPlatform === 0) {
    //   //render Game chart 
    //   //chart=<GameChart platform="Mobile" selectedInfo="playtime || utilization || score">
    // }
    // else if (this.currentPlatform === 1) {
    //   //render Game chart 
    //   //chart=<GameChart platform="PC" selectedInfo="playtime || utilization || score">
    // }
    // else {
    //   //render Game chart 
    //   //chart=<GameChart platform="VR" selectedInfo="playtime || utilization || score">
    // }


    return (
    <Container>
    <Template/>

    <br/><br/>

    {/* <Row>
      <h3>Statistics for Modules: </h3>
      {this.getModuleChartButtons()}
    </Row>
    <Collapse isOpen={this.state.moduleChartOpen}>
      <Card>
        {this.renderModuleChart()}        
      </Card>
    </Collapse>
    <br/><br/>
    <Row>
      <h3>Statistics for Games: </h3>
      {this.getGameChartButtons()}
    </Row>
    <Collapse isOpen={this.state.gameChartOpen}>
      <Card>
        {this.renderGameChart()}
      </Card>
    </Collapse> */}
    <Row>
      <Col>
      <Card color="info" style={{color: "white"}}>
        <CardHeader>Overview</CardHeader>
        <CardBody>
          <Row>
            <Col>Best Performing Platform</Col>
            <Col>Most Utilized Platform</Col>
            <Col>Best Performing Module</Col>
            <Col>{this.renderLanguageList()}</Col>
          </Row>
        </CardBody>
      </Card>
      </Col>
    </Row>

    <br/><br/>

    <Row> 
      <Col>
        <Card body className="text-center" style={{backgroundColor: "#05716c", height: "45vh"}}
          onMouseEnter={() => this.handleMouseHover(0)}
          onMouseLeave={() => this.handleMouseHover(0)}
        > 
        {this.state.isHoveringMobile ?
          <this.platformContainer platform={0} toggleChart={this.toggleChart}/>
          :
          <Container style={{paddingTop: "125px"}}>
            <CardText style={{fontFamily: "auto", fontSize: "35px", fontWeight: "bold", color: "white"}}>
              <img src={require('../Images/phone.png')} style={{width: "35px", height: "35px", marginRight: "10px"}}/>
              Mobile
            </CardText>
          </Container>
        }
        </Card>
      </Col>
      <Col>
        <Card body className="text-center" style={{backgroundColor: "#05716c", height: "45vh"}}
          onMouseEnter={() => this.handleMouseHover(1)}
          onMouseLeave={() => this.handleMouseHover(1)}
        > 
        {this.state.isHoveringPC ?
          <this.platformContainer platform={1} toggleChart={this.toggleChart}/>
          :
          <Container style={{paddingTop: "125px"}}>
            <CardText style={{fontFamily: "auto", fontSize: "35px", fontWeight: "bold", color: "white"}}>
              <img src={require('../Images/computer.png')} style={{width: "35px", height: "35px", marginRight: "10px"}}/>
              PC
            </CardText>
          </Container>
        }
        </Card>
      </Col>
      <Col>
        <Card body className="text-center" style={{backgroundColor: "#05716c", height: "45vh"}}
          onMouseEnter={() => this.handleMouseHover(2)}
          onMouseLeave={() => this.handleMouseHover(2)}
        > 
        {this.state.isHoveringVR ?
          <this.platformContainer platform={2} toggleChart={this.toggleChart}/>
          :
          <Container style={{paddingTop: "125px"}}>
            <CardText style={{fontFamily: "auto", fontSize: "35px", fontWeight: "bold", color: "white"}}>
              <img src={require('../Images/vr-glasses.png')} style={{width: "35px", height: "35px", marginRight: "10px"}}/>
              VR
            </CardText>
          </Container>
        }
        </Card>
      </Col>
    </Row>

    <br/><br/>
    
    <Collapse isOpen={this.state.displayChart}>
      <Card>
        <CardBody>
        Anim pariatur cliche reprehenderit,
          enim eiusmod high life accusamus terry richardson ad squid. Nihil
          anim keffiyeh helvetica, craft beer labore wes anderson cred
          nesciunt sapiente ea proident.
          {/* <GameChart platform={this.state.currentPlatform} selectedInfo={this.state.selectedChartInfo} /> */}
        </CardBody>
      </Card>
    </Collapse>

    <br/><br/>
    
    </Container>
    )
  }
}
