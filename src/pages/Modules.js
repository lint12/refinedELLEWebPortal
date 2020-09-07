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
      selectedClass: {value: 0, label: "All"},
      classChanged: false,
      classes: [], 
      permissionLevels: [], 
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
          this.getAllAnswers();
        }

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

    console.log("UPDATING THE MODULE LIST: ", this.state.selectedClass); 

    if (this.state.selectedClass === null) {
      return; 
    }

    if (this.state.selectedClass.value === 0) {
      axios.get(this.props.serviceIP + '/modules', header)
        .then(res => {
          
          let modules = res.data;

          if(modules.length === 0){
            this.toggleEmptyCollectionAlert();
          }
          
          this.setState({ modules : modules,
                          dynamicModules: modules,
                          classChanged: false
                        });

          console.log("FIRST MODULE: ", modules[0]);

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
      console.log("Config: ", config); 
      axios.get(this.props.serviceIP + '/retrievegroupmodules', config)
      .then(res => {
        let modules = res.data;

        console.log("MODULES: ", modules);

        if(modules.length === 0){
          this.toggleEmptyCollectionAlert();
        }
        
        this.setState({ modules : modules,
                        dynamicModules: modules, 
                        classChanged: false 
                      });

        console.log("FIRST MODULE: ", modules[0]);
        
        this.updateCurrentModule({ module: modules[0] }); 
      })
      .catch(function (error) {
        console.log("updateModuleList error: ", error.message);
      });
    }
  }

  //function for getting the elements in the current module
  updateCurrentModule = (event) => {
    var data = {
      moduleID: event.module.moduleID
    }

    var headers = {
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    }

    axios.post(this.props.serviceIP + '/modulequestions', data, {headers:headers})
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

        console.log("In update current module: ", res.data); 
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

    console.log("in deleteModule, id: ", id);
    
    let header = { 
      data: {moduleID: id }, 
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }

    
    axios.delete(this.props.serviceIP + '/module', header)
      .then( res => {
        console.log("in deleteModule, res.data: ", res.data);

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
    this.setState({ emptyCollection: true });
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

  updateClassContext = (value) => {
    if (value !== null) {
      console.log("Selected Class: ", value);
      let currentClass = this.state.permissionLevels.find((group) => group.groupID === value.value);
      console.log("CURRENT CLASS: ", currentClass);

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
      console.log(error.response); 
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
