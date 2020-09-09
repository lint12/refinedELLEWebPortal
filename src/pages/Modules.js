import React, { Component } from 'react';
import { Collapse, Button, Card, Input, InputGroup,
   InputGroupAddon, Container, Row, Col, Alert, Label } from 'reactstrap';
import axios from 'axios';
import Select from 'react-select';
  
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
      selectedClass: {value: 0, label: "All"},
      classChanged: false,
      classes: [], 
      permissionLevels: [], //TODO: consider renaming this to something more intuitive
      currentPermissionLevel: localStorage.getItem('per')
    };
  }


  componentDidMount() {
      this.initializeModulesPage();
      this.getClasses();
      this.getPermissionLevels();
  }


  //function for initializing module list on sidebar and setting current module to the first one
  initializeModulesPage = () => { 

    this.updateModuleList();
    if(this.state.modules.length > 0){
      this.setState({ moduleName: this.state.modules[0].name,
                      currentModule: this.state.modules[0]
                    })
    }

  }

  //function for updating the module list on the sidebar with what's in the database
  updateModuleList = () => {
    let header = {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    };

    //TODO: this shouldn't be possible, consider deleting
    if (this.state.selectedClass === null) {
      return; 
    }

    //TODO: this would be neater if, when you make an API call to 
    // /retrievegroupmodules, and the group value is 0, it returns all modules
    // consider asking for a change
    if (this.state.selectedClass.value === 0) {
      axios.get(this.props.serviceIP + '/modules', header)
        .then(res => {
          console.log("in updateModuleList, modules: ", res.data);
          let modules = res.data;

          if(modules.length === 0){
            this.toggleEmptyCollectionAlert();
          }
          
          this.setState({ modules : modules,
                          dynamicModules: modules,
                          classChanged: false
                        });

          this.updateCurrentModule({ module: modules[0] }); 
        })
        .catch(function (error) {
          console.log("updateModuleList error: ", error.message);
        });
    }
    else {
      let config = {
        params: {groupID: this.state.selectedClass.value}, 
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
      }

      axios.get(this.props.serviceIP + '/retrievegroupmodules', config)
      .then(res => {
        let modules = res.data;


        if(modules.length === 0){
          this.toggleEmptyCollectionAlert();
        }
        
        this.setState({ modules : modules,
                        dynamicModules: modules, 
                        classChanged: false 
                      });

        
        this.updateCurrentModule({ module: modules[0] }); 
      })
      .catch(function (error) {
        console.log("updateModuleList error: ", error.message);
      });
    }
  }

  //function for getting the elements in the current module
  updateCurrentModule = (event) => {
    console.log("updateCurrentModule, event.module: ", event.module);
    var data = {
      moduleID: event.module.moduleID
    }

    var header = {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }

    axios.post(this.props.serviceIP + '/modulequestions', data, header)
      .then( res => {
        console.log("updateCurrentModule res.data: ", res.data);


        let cards = res.data;

        this.setState({
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

        console.log("ALL ANS IN DB before filter: ", allAnswersInDB); 

        //gets rid of responses that have type "PH", for phrases
        allAnswersInDB = allAnswersInDB.filter((answer) => {
          if(answer.type !== 'PH'){
            return true;
          } else{
            return false;
          }
        });

        //gets tje information we'll actually use from the get response
        allAnswersInDB = allAnswersInDB.map((answer) => {
          return ({ front: answer.front, //Foreign version of the word
                    back: answer.back, //English version of the word
                    id: answer.termID
                  })
        });

        console.log("ALL ANS IN DB: ", allAnswersInDB); 

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

        console.log("ALL ANS MINUS THE DUPES: ", allAnswersMinusDupes); 

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
      complexity: 2, //all modules will have complexity 2
      groupID: localStorage.getItem('per') === "st" ? this.state.selectedClass.value : null
    }

    console.log("EDIT MODULE DATA: ", data); 
    let header = {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }

    axios.put(this.props.serviceIP + '/module', data, header)
      .then( res => {

        this.updateModuleList(); 
 
        if (this.state.currentModule.name === event.module.name) {
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
      data: {
        moduleID: id,
        groupID: localStorage.getItem('per') === "st" ? this.state.selectedClass.value : null
      }, 
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }

    console.log("DELETE MODULE DATA: ", header.data); 
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


  //function for making the searchbar for the module list work
  updateSearchDeck(e) {

    //returns true if any part of module name matches the search string
    let newModuleList = this.state.modules
      .filter((module) => {
        if(module){
          return(module.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1)
        } else{
          return false;
        }
      }
      );

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
    this.setState({ emptyCollection: true });
  }

  getClasses = () => {
    let header = {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }

    axios.get(this.props.serviceIP + '/searchusergroups', header)
      .then(res => {
        this.setState({ classes: res.data })
      })
      .catch(error => {
        console.log("getClasses error: ", error); 
      })
  }

  updateClassContext = (value) => {
    if (value !== null) {
      let currentClass = this.state.permissionLevels.find((group) => group.groupID === value.value);

      this.setState({
        selectedClass: value, 
        classChanged: true,
        currentPermissionLevel: value.value === 0 ? localStorage.getItem('per') : currentClass.accessLevel
      }); 
    }
  } 

  getPermissionLevels = () => {
    axios.get(this.props.serviceIP + '/userlevels', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }).then(res => {
      console.log("PERMISSION LEVELS: ", res.data); 
      this.setState({ permissionLevels: res.data })
    }).catch(error => {
      console.log("getPermissionLevels error: ", error); 
    })
  }

  render() {
    let classOptions = []; 
    classOptions.push({value: 0, label: "All"}); 

    this.state.classes.map((item) => {classOptions.push({value: item.groupID, label: item.groupName})}); 

    return (
    <Container>
    <Template/>

    <br/><br/>

    <Row style={{marginBottom: "15px"}}>
      <Col className="Left Column" xs="3">
        <h3 style={{margin: "5px 0 0 0"}}>Your ELLE Modules:</h3>
      </Col>

      {this.state.currentPermissionLevel !== "su" ?
      <Col className="Right Column" style={{display: "flex", justifyContent: "flex-end"}}>
        {/*Class Context*/}
          <Label style={{margin: "5px 8px 0 0", fontSize: "large"}}>Class: </Label>
          <Select
            name="selectedClass"
            options={classOptions}
            className="basic-single"
            classNamePrefix="select"
            isClearable={true}
            value={this.state.selectedClass}
            onChange={this.updateClassContext}
            styles={{
              valueContainer: () => ({width: '147px'}),
              // Fixes the overlapping problem of the component
              menu: provided => ({ ...provided, zIndex: 9999 }), 
              singleValue: provided => ({ ...provided, margin: "0 0 0 10px"}),
              input: provided => ({ ...provided, margin: "0 0 0 10px"})
            }}
          />
          {this.state.classChanged ? this.updateModuleList() : null}
      </Col>
      : null}

    </Row>
    <Row className="Seperated Col">
      <Col className="Left Column" xs="3">
        
        {/*Search Bar for module list*/}
        <InputGroup style={{borderRadius: '12px'}}>
          <Input 
            placeholder="Search" 
            value={this.state.searchDeck} 
            onChange={this.updateSearchDeck.bind(this)}
            />
          {this.state.currentPermissionLevel !== 'st' 
          ? 
            <InputGroupAddon addonType="append">
              <Button style={{backgroundColor:'#3e6184'}} onClick={this.toggleNewModule}>
                Add Module
              </Button>
            </InputGroupAddon>
          : null}
        </InputGroup>

        <br/>

        {/*Form for adding a new module*/}
        <Collapse isOpen={this.state.collapseNewModule}>
          <AddModule  
            serviceIP={this.props.serviceIP} 
            updateModuleList={this.updateModuleList}
            classOptions={classOptions}
            currentClass={this.state.selectedClass}
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
                    permissionLevel={this.state.currentPermissionLevel}
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
                permissionLevel={this.state.currentPermissionLevel}
                currentClass={this.state.selectedClass}
                moduleName={this.state.moduleName}
                curModule={this.state.currentModule}
                cards={this.state.cards}
                serviceIP={this.props.serviceIP}
                updateCurrentModule={this.updateCurrentModule}
                allAnswers={this.state.allAnswers}
                />
              : 
              <Alert isOpen={this.state.emptyCollection}>
                {this.state.currentPermissionLevel !== "st" 
                ? 
                  "You have no modules in this class, please create one by clicking on the Add Module Button to your left."
                :
                  "There are currently no modules in this class."
                }
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
