import React, { Component } from 'react';
import { Collapse, Button, Card, Input, InputGroup,
   InputGroupAddon, Container, Row, Col, Alert} from 'reactstrap';
import axios from 'axios';
  
import AddModule from '../components/Decks/AddModule';
import Deck from '../components/Decks/Deck';
import Template from './Template';
import SplitDeckBtn from './SplitDeckBtn';

import '../stylesheets/style.css';
import '../lib/bootstrap/css/bootstrap.min.css';
import '../lib/font-awesome/css/font-awesome.min.css';
import '../lib/owlcarousel/assets/owl.carousel.min.css';
import '../lib/ionicons/css/ionicons.min.css';

export default class Modules extends Component {
  constructor(props) {
    super(props);
    this.toggleNewModule = this.toggleNewModule.bind(this);
    this.change = this.change.bind(this);
    this.deleteModule = this.deleteModule.bind(this);
    this.updateModuleList = this.updateModuleList.bind(this);
    this.updateCurrentModule = this.updateCurrentModule.bind(this);
    this.initializeModulesPage = this.initializeModulesPage.bind(this);


    this.state = {
      userID: "",
      username: "",


      modules: [], //list of all modules in the database
      dynamicModules: [], //list of modules filtered by search bar

      audio: [],
      image: [],

      currentModule: [], //current module we're looking at

      cards: [], //cards in the module we're looking ats

      //for deleting a deck
      deckID: "",
      //for adding a new deck 
      deckName: "",
      ttype: "",

      searchDeck: '',
      collapseNewModule: false,
      emptyCollection: false, //true when there are no modules, false otherwise
    };
  }

  componentDidMount() {
      console.log("Decks has mounted")
      this.initializeModulesPage();
  }


  //populates the sidebar list of modules
  //sets the current module we're looking at to the first module on the list
  initializeModulesPage = () => {
    console.log("initializing ModuleList on sidebar"); 
    
    axios.get(this.props.serviceIP + '/modules', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }).then(res => {
      
      let modules = res.data; 
      console.log("initialized list, modules: ", modules);

      this.setState({ currentModule: modules[0],
                      modules : modules,
                      dynamicModules: modules });

      if (this.state.modules.length === 0) {
        this.toggleEmptyCollectionAlert(); 
      };

      //setting the displayed module to currentModule
      this.updateCurrentModule({module: this.state.currentModule});

    }).catch(function (error) {
      console.log(error);
    });
  }

  //makes an API call to get the module list on sidebar, and updates it
  //(it worked when it wasn't an arrow function, hasn't been tested since convered to arrow function)
  updateModuleList = () => {
    console.log("updating ModuleList on sidebar"); 
    axios.get(this.props.serviceIP + '/modules', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }).then(res => {
      
      let modules = res.data; 
      console.log("updated list, modules: ", modules);

      this.setState({ modules : modules,
                      dynamicModules: modules });

      if (this.state.modules.length === 0) {
        this.toggleEmptyCollectionAlert(); 
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  //makes an API call to get the list of cards in the current module, which will then be displayed
  updateCurrentModule = (event) => {
    console.log("Updating current module: ", event.module);
    axios.post(this.props.serviceIP + '/modulequestions', { moduleID: event.module.moduleID, 
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }).then( res => {
      console.log("updateCurrentModule, res.data: ", res.data);
      let cards = res.data;
      this.setState({
        id: event.module.termID,
        module: event.module,
        deckName: event.module.name,
        cards: cards,
        currentModule: event.module
      });
    }).catch(function (error) {
      console.log("updateCurrentModule error: ", error);
    });
  }

  deleteModule = (id) => {
    console.log("Delete Module ID: ", id); 
    console.log("serviceIP in modules: ", this.props.serviceIP); 
    axios.delete(this.props.serviceIP + '/module', { data: {moduleID: id }, 
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
  }).then( res => {
      console.log(res.data);
      this.updateModuleList(); 
    }).catch(function (error) {
      console.log(error);
    });
  }

  change(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  updateSearchDeck(e) {

    let filterFunction = (module) => {
      let moduleName = module.name;
      let namePrefix = moduleName.substr(0,e.target.value.length);

      if(namePrefix.toLowerCase() === e.target.value.toLowerCase()){
        return true;
      } else {
        return false;
      }
    }

    let newModuleList = this.state.modules.filter(filterFunction);

    this.setState({ searchDeck: e.target.value.substr(0,20),
                    dynamicModules: newModuleList 
                  });
  }

  toggleNewModule() {
    this.setState({ collapseNewModule: !this.state.collapseNewModule });
  }

  toggleEmptyCollectionAlert() {
    this.setState({ emptyCollection: !this.state.emptyCollection });
  }

  render() {
    console.log("rendering Modules page");
    return (
    <Container>
    <Template/>
    <br></br><br></br>
    <h4>Your Elle VR Modules:</h4>
    <Row className="Seperated Col">
      <Col className="Left Column" xs="3">
        <InputGroup style={{borderRadius: '12px'}}>
          <Input placeholder="Search" value={this.state.searchDeck} onChange={this.updateSearchDeck.bind(this)}/>
          <InputGroupAddon addonType="append"><Button style={{backgroundColor:'#3e6184'}} onClick={this.toggleNewModule}>Add Module</Button></InputGroupAddon>
        </InputGroup>
        <br></br>
        <Collapse isOpen={this.state.collapseNewModule}>
          <AddModule  serviceIP={this.props.serviceIP} 
                      updateModuleList={this.updateModuleList}>
          </AddModule>
        </Collapse>
        <Row>
          <Col>
            <Card color="info" style={{overflow:"scroll", height:"65vh"}}>
              {
                this.state.dynamicModules.map((deck, i)=> (
                  <SplitDeckBtn 
                    key={i}
                    id={deck.moduleID} 
                    curModule={deck} 
                    updateCurrentModule={this.updateCurrentModule}
                    deleteModule={this.deleteModule}>
                  </SplitDeckBtn>
                ))
              }
            </Card>
          </Col>
        </Row>
      </Col>
      <Col className="Right Column">
        <Row>
          <Col>
            {this.state.modules.length !== 0 ? 
            <Deck
              curModule={this.state.currentModule}
              cards={this.state.cards}
              serviceIP={this.props.serviceIP}
              updateCurrentModule={this.updateCurrentModule}>
            </Deck> : 
            <Alert isOpen={this.state.emptyCollection}>You have no modules, please create one by clicking on the Add Module Button to your left.</Alert>}
            <br></br><br></br>
          </Col>
        </Row>
      </Col>
    </Row>
    </Container>
    )
  }
}
