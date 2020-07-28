import React, { Component } from 'react';
import { Collapse, Button, Card, Input, InputGroup,
   InputGroupAddon, Container, Row, Col, Alert } from 'reactstrap';
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
    this.editModule = this.editModule.bind(this); 
    this.deleteModule = this.deleteModule.bind(this);
    this.updateModuleList = this.updateModuleList.bind(this);
    this.updateCurrentModule = this.updateCurrentModule.bind(this);
    this.initializeModulesPage = this.initializeModulesPage.bind(this);


    this.state = {
      moduleName: "", //for changing moduleNAME after a module edit 
      modules: [], //list of all modules in the database
      dynamicModules: [], //list of modules filtered by search bar

      currentModule: [], //current module we're looking at

      cards: [], //cards in the module we're looking ats

      allAnswers: [], //list of terms an addQuestion form will use for autocomplete
 
      searchDeck: '', //what gets typed in the search bar that filters the module list
      collapseNewModule: false, //determines whether or not the new module form is open
      emptyCollection: false, //true when there are no modules, false otherwise
    };
  }


  componentDidMount() {
      this.initializeModulesPage();
  }


  //function for initializing module list on sidebar and setting current module to the first one
  initializeModulesPage = () => { 

    let header = { 
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') } 
      };
    
    axios.get(this.props.serviceIP + '/modules', header)
      .then(res => {
      
        let modules = res.data;


        if (modules.length === 0) {
          this.toggleEmptyCollectionAlert(); 
        }
        else {
          this.setState({ moduleName: modules[0].name, 
                          currentModule: modules[0],
                          modules : modules,
                          dynamicModules: modules });

          this.updateCurrentModule({module: this.state.currentModule});
        }

        this.getAllAnswers();

      })
      .catch(function (error) {
        console.log("initializeModulesPage error: ", error);
      });
  }

  //function for updating the module list on the sidebar with what's in the database
  updateModuleList = () => {

    let header = {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    };

    axios.get(this.props.serviceIP + '/modules', header)
      .then(res => {
        
        let modules = res.data;

        if(modules.length === 0){
          this.toggleEmptyCollectionAlert();
        }
        
        this.setState({ modules : modules,
                        dynamicModules: modules });

        
      })
      .catch(function (error) {
        console.log("updateModuleList error: ", error);
      });
  }

  //function for getting the elements in the current module
  updateCurrentModule = (event) => {

    let header = { 
      moduleID: event.module.moduleID, 
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    };
    
    axios.post(this.props.serviceIP + '/modulequestions', header)
      .then( res => {

        let cards = res.data;

        this.setState({
          id: event.module.termID,
          module: event.module,
          moduleName: event.module.name, 
          cards: cards,
          currentModule: event.module
        });

        this.getAllAnswers();
      })
      .catch(function (error) {
        console.log("updateCurrentModule error: ", error);
      });
  }

  getAllAnswers = () => {

    let allAnswersInDB = [];

    let header = {
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
      params: {language: this.state.currentModule.language}  
    };

    axios.get(this.props.serviceIP + '/term', header)
      .then(res => {
        allAnswersInDB = res.data;

        //gets rid of responses that have type "PH", for phrases
        allAnswersInDB = allAnswersInDB.filter((answer) => {
          if(answer.type !== 'PH'){
            return true;
          } else{
            return false;
          }
        });

        //TODO: consider deleting this
        //gets rid of duplicates. 
        //If allAnswersInDB.indexOF(answer) != answerIndex, 
        //then the answer in question isn't the first appearance
        allAnswersInDB = allAnswersInDB.filter((answer, answerIndex) => {
          if(allAnswersInDB.indexOf(answer) === answerIndex){
            return true;
          } else{
            return false;
          }
        })

        //gets tje information we'll actually use from the get response
        allAnswersInDB = allAnswersInDB.map((answer) => {
          return ({ front: answer.front, //Foreign version of the word
                    back: answer.back, //English version of the word
                    id: answer.termID
                  })
        });

        //---
        //removes duplicates
        let frontArray = [];
        let allAnswersMinusDupes = [];
        for(let i = 0; i < allAnswersInDB.length; i++){
          if(frontArray.indexOf(allAnswersInDB[i].front) === -1){
            frontArray.push(allAnswersInDB[i].front);
            allAnswersMinusDupes.push(allAnswersInDB[i]);
          }
        }
        //---

        this.setState({
          allAnswers: allAnswersMinusDupes
        });

      })
      .catch(error => {
        console.log("error in getAllAnswers: ", error);
      })
  }


  //funcion for editing the name of a module
  editModule = (editedName, event) => {

    var data = {
      moduleID: event.module.moduleID,
      name: editedName, 
      language: event.module.language,
      complexity: 2 //all modules will have complexity 2
    }

    console.log("EDIT MODULE DATA: ", data)

    let header = {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }

    axios.put(this.props.serviceIP + '/module', data, header)
      .then( res => {

        this.updateModuleList(); 
 
        if (this.state.currentModule.name === event.module.name) {
          console.log("CURRENTLY SHOWING THE SAME MODULE AS THE ONE YOUVE EDITED")
          this.setState({moduleName: editedName}); 
        }

      })
      .catch(function (error) {
        console.log("editModule error: ", error);
      });
  }

  //function for deleting a module
  deleteModule = (id) => {
    let header = { 
      data: {moduleID: id }, 
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }

    
    axios.delete(this.props.serviceIP + '/module', header)
      .then( res => {

        this.updateModuleList(); 

        if (id === this.state.currentModule.moduleID)
          this.updateCurrentModule({module: this.state.modules[0]}); 

      })
      .catch(function (error) {
        console.log("deleteModule error: ", error);
      });
  }

  //this never gets used and should probably be deleted
  change(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  //function for making the searchbar for the module list work
  updateSearchDeck(e) {

    //returns true if first part of module name matches the search string
    //TODO: consider changing it so that search string can be any substring of module name
    let filterFunction = (module) => {
      /*
      let moduleName = module.name;
      let namePrefix = moduleName.substr(0,e.target.value.length);

      if(namePrefix.toLowerCase() === e.target.value.toLowerCase()){
        return true;
      } else {
        return false;
      }
      */

      
      if(module){
        return(module.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1)
      } else{
        return false;
      }
      
    }

    let newModuleList = this.state.modules.filter(filterFunction);

    this.setState({ searchDeck: e.target.value.substr(0,20),
                    dynamicModules: newModuleList 
                  });
  }

  //function that toggles whether or not the new module form is shown
  toggleNewModule() {
    this.setState({ collapseNewModule: !this.state.collapseNewModule });
  }

  //function that toggles whether or not the empty collection alert is shown
  toggleEmptyCollectionAlert() {
    this.setState({ emptyCollection: !this.state.emptyCollection });
  }


  render() {
    return (
    <Container>
    <Template/>

    <br/><br/>

    <h4>Your Elle VR Modules:</h4>
    <Row className="Seperated Col">
      <Col className="Left Column" xs="3">
        
        {/*Search Bar for module list*/}
        <InputGroup style={{borderRadius: '12px'}}>
          <Input 
            placeholder="Search" 
            value={this.state.searchDeck} 
            onChange={this.updateSearchDeck.bind(this)}
            />
          <InputGroupAddon addonType="append">
            <Button style={{backgroundColor:'#3e6184'}} onClick={this.toggleNewModule}>
              Add Module
            </Button>
          </InputGroupAddon>
        </InputGroup>

        <br/>

        {/*Form for adding a new module*/}
        <Collapse isOpen={this.state.collapseNewModule}>
          <AddModule  
            serviceIP={this.props.serviceIP} 
            updateModuleList={this.updateModuleList}
            />
        </Collapse>

        <Row>
          <Col>
            
            {/*Module list on the left side of the page*/}
            <Card color="info" style={{overflow:"scroll", height:"65vh"}}>
              {
                this.state.dynamicModules.map((deck, i)=> (
                  <SplitDeckBtn 
                    key={i}
                    id={deck.moduleID} 
                    curModule={deck} 
                    updateCurrentModule={this.updateCurrentModule}
                    deleteModule={this.deleteModule}
                    editModule={this.editModule}
                    />
                ))
              }
            </Card>

          </Col>
        </Row>
      </Col>
      <Col className="Right Column">
        <Row>
          <Col>

            {/*Either the contents of current module, or alert saying there are no modules*/}
            {
              this.state.modules.length !== 0 ? 
              <Deck
                moduleName={this.state.moduleName}
                curModule={this.state.currentModule}
                cards={this.state.cards}
                serviceIP={this.props.serviceIP}
                updateCurrentModule={this.updateCurrentModule}
                allAnswers={this.state.allAnswers}
                />
              : 
              <Alert isOpen={this.state.emptyCollection}>
              You have no modules, please create one by clicking on the Add Module Button to your left.
              </Alert>
            }

            <br/><br/>
            
          </Col>
        </Row>
      </Col>
    </Row>
    </Container>
    )
  }
}
