import React, { Component, Fragment } from 'react';
import { Collapse, Button, Card, Input, InputGroup,
   InputGroupAddon, Container, Row, Col, Alert } from 'reactstrap';
import axios from 'axios';
  
import AddModule from '../components/Decks/AddModule';
import Deck from '../components/Decks/Deck';
import Template from './Template';
import SplitDeckBtn from './SplitDeckBtn';
import GameChart from '../components/Stats/GameChart';
import ModuleChart from '../components/Stats/ModuleChart';

import '../stylesheets/style.css';
import '../lib/bootstrap/css/bootstrap.min.css';
import '../lib/font-awesome/css/font-awesome.min.css';
import '../lib/owlcarousel/assets/owl.carousel.min.css';
import '../lib/ionicons/css/ionicons.min.css';

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

      gameChartOpen: false
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

  render() {
    return (
    <Container>
    <Template/>

    <br/><br/>

    <Row>
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
    </Collapse>
      

    


    
    </Container>
    )
  }
}
