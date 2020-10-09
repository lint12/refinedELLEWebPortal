import React, { Component } from 'react';
import { Collapse, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, Input, InputGroup,
   InputGroupAddon, Container, Row, Col, Alert, Label, Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import axios from 'axios';
import Select from 'react-select';
  
import Template from './Template';
import AddExistingModule from '../components/Decks/AddExistingModule';
import AddModule from '../components/Decks/AddModule';
import StudentView from '../components/ModuleList/StudentView';
import AdminView from '../components/ModuleList/AdminView';
import SuperAdminView from '../components/ModuleList/SuperAdminView';
import Deck from '../components/Decks/Deck';

export default class Modules extends Component {
  constructor(props) {
    super(props);
    this.toggleAddModuleButton = this.toggleAddModuleButton.bind(this);
    this.editModule = this.editModule.bind(this); 
    this.deleteModule = this.deleteModule.bind(this);
    this.updateModuleList = this.updateModuleList.bind(this);
    this.updateCurrentModule = this.updateCurrentModule.bind(this);

    this.state = {
      modules: [], //list of all modules in the database
      dynamicModules: [], //list of modules filtered by search bar

      currentModule: [], //current module we're looking at

      cards: [], //cards in the module we're looking ats

      allAnswers: [], //list of terms an addQuestion form will use for autocomplete
 
      searchDeck: '', //what gets typed in the search bar that filters the module list
      addModuleButtonOpen: false, //determines whether or not the add module dropdown button is open
      openForm: 0, //determines which input form is open. Is 0 if no form is open
      emptyCollection: false, //true when there are no modules, false otherwise
      modificationWarning: false, 

      selectedClass: {value: 0, label: "All"},
      classChanged: false,
      classes: [], 
      groupPermissionLevels: [], 
      currentPermissionLevel: this.props.user.permission
    };
  }

  componentDidMount() {
    this.verifyPermission(); 
    this.updateModuleList("initialize", null); 
    this.getClasses();
    this.getGroupPermissionLevels();
  }

  verifyPermission = () => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      this.props.history.push('/home');
    }
    else {
      var jwtDecode = require('jwt-decode');

      var decoded = jwtDecode(jwt);
      console.log("JWT DECODED: ", decoded);

      this.setState({ currentPermissionLevel: decoded.user_claims }); 
    }
  }

  //function for updating the module list on the sidebar with what's in the database
  updateModuleList = (task, moduleID) => {
    let header = {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
      params: {groupID: this.state.currentPermissionLevel === "ta" ? this.state.selectedClass.value : null} 
    };

    axios.get(this.props.serviceIP + '/retrieveusermodules', header)
    .then(res => {
      console.log("RETRIEVE USER MODULES RESPONSE: ", res.data); 
      let allModules = res.data; 

      if(allModules.length === 0) {
        this.toggleEmptyCollectionAlert();
        return; 
      }

      if (this.state.selectedClass.value === 0) {
        this.setState({
          modules: allModules,
          dynamicModules: allModules,
          classChanged: false
        })

        //when a new module is added you want to display that new module 
        if (task === "add") {
          console.log("SHOWING ADDED MODULE");
          let newModule = allModules.find((module) => module.moduleID === moduleID);
          this.updateCurrentModule({ module: newModule }); 
          this.toggleModificationWarning("new");
        }
        else if (task === "unlink") {
          if (moduleID === this.state.currentModule.moduleID)
            this.updateCurrentModule({ module: allModules[0] }); 
        }
        //when the page is first initialized or when the class context has changed then display the first module in the list 
        else if (task === "initialize" || task === "change") {
          this.updateCurrentModule({ module: allModules[0] }); 
        }
      }
      else {
        let groupSpecificModules = allModules.filter((module) => module.groupID === this.state.selectedClass.value);

        if(groupSpecificModules.length === 0) {
          this.setState({ 
            dynamicModules: [], 
            currentModule: [],
            classChanged: false 
          });
          this.toggleEmptyCollectionAlert();
          return; 
        }

        this.setState({ 
          modules: allModules,
          dynamicModules: groupSpecificModules, 
          classChanged: false 
        });

        //when a new module is added you want to display that new module 
        if (task === "add") {
          console.log("SHOWING ADDED MODULE");
          let newModule = groupSpecificModules.find((module) => module.moduleID === moduleID);
          this.updateCurrentModule({ module: newModule }); 
          this.toggleModificationWarning("new");
        }
        else if (task === "unlink") {
          if (moduleID === this.state.currentModule.moduleID)
            this.updateCurrentModule({ module: groupSpecificModules[0] }); 
        }
        //when the page is first initialized or when the class context has changed then display the first module in the list 
        else if (task === "change") {
          this.updateCurrentModule({ module: groupSpecificModules[0] }); 
        }
      } 

    }).catch(error => {
      console.log("updateModuleList error: ", error); 
    })      
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


  //function for editing the name of a module
  editModule = (editedName, event) => {

    var data = {
      moduleID: event.module.moduleID,
      name: editedName, 
      language: event.module.language,
      complexity: 2, //all modules will have complexity 2
      groupID: this.state.currentPermissionLevel === "st" ? this.state.selectedClass.value : null
    }

    console.log("EDIT MODULE DATA: ", data); 
    let header = {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }

    axios.put(this.props.serviceIP + '/module', data, header)
      .then( res => {

        this.updateModuleList("edit", null); 
 
        if (this.state.currentModule.moduleID === event.module.moduleID) {
          console.log("MODULE NAME BEING UPDATED IS THE SAME ONE THAT IS BEING DISPLAYED")
          this.setState({ currentModule: res.data }); 
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
        groupID: this.state.currentPermissionLevel === "st" ? this.state.selectedClass.value : null
      }, 
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }

    console.log("DELETE MODULE DATA: ", header.data); 
    axios.delete(this.props.serviceIP + '/module', header)
      .then( res => {

        this.updateModuleList("delete", null); 

        if (id === this.state.currentModule.moduleID)
          this.updateCurrentModule({module: this.state.modules[0]}); 

      })
      .catch(function (error) {
        console.log("deleteModule error: ", error.message);
      });
  }

  //function to unlink a module from a group 
  unlinkModule = (id) => {
    var data = {
      moduleID: id,
      groupID: this.state.selectedClass.value
    }

    let header = {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }

    axios.post(this.props.serviceIP + '/addmoduletogroup', data, header)
    .then(res => {
      console.log("unlink Module res.data: ", res.data);

      this.updateModuleList("unlink", id); 

    }).catch(function (error) {
      console.log(error.message);
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
      });

    this.setState({ 
      searchDeck: e.target.value.substr(0,20),
      dynamicModules: newModuleList 
    });
  }

  //function that toggles whether or not the new module form is shown
  toggleAddModuleButton() {
    this.setState({ addModuleButtonOpen: !this.state.addModuleButtonOpen });
  }

  //function that determines which form is open
  setOpenForm = (openedForm) => {
    //if the form is open at the moment then close it by setting it back to form 0, which is the closed state
    if(this.state.openForm === openedForm){
      this.setState({ openForm: 0 })
    }
    else { //else set the state of the open form to the form # that you want to open
      this.setState({ openForm: openedForm })
    }

  }

  //function that toggles whether or not the empty collection alert is shown
  toggleEmptyCollectionAlert() {
    this.setState({ emptyCollection: true });
  }

  toggleModificationWarning = (condition) => {
    console.log("Toggling warning"); 
    if (condition === "new") {
      this.setState({ modificationWarning: true }); 
    }
    else {
      this.setState({ modificationWarning: !this.state.modificationWarning }); 
    }
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
      let currentClass = this.state.groupPermissionLevels.find((group) => group.groupID === value.value);

      this.setState({
        selectedClass: value, 
        classChanged: true,
      }); 

      value.value === 0 ? this.verifyPermission() : this.setState({currentPermissionLevel: currentClass.accessLevel}); 
    }
    else {
      this.setState({
        selectedClass: {value: 0, label: "All"},
        classChanged: true,
      })
      this.verifyPermission(); 
    }
  } 

  getGroupPermissionLevels = () => {
    axios.get(this.props.serviceIP + '/userlevels', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }).then(res => {
      console.log("PERMISSION LEVELS: ", res.data); 
      this.setState({ groupPermissionLevels: res.data })
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
    <Template permission={this.state.currentPermissionLevel}/>

    <br/>
    <Row style={{marginBottom: "15px"}}>
      <Col className="Left Column" xs="3">
        <h3 style={{margin: "5px 0 0 0", color: "#16a3b8"}}>Your ELLE Modules:</h3>
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
          {this.state.classChanged ? this.updateModuleList("change", null) : null}
      </Col>
      : null}

    </Row>
    <Row className="Seperated Col">
      <Col className="Left Column" xs="3">
        
        {/*Search Bar for module list*/}
        <InputGroup style={{borderRadius: '12px'}}>
          <InputGroupAddon addonType="prepend" style={{margin: "10px"}}>
            <img 
              src={require('../Images/search.png')} 
              alt="Icon made by Freepik from www.flaticon.com" 
              style={{width: '15px', height: '15px'}}
            />
          </InputGroupAddon>
          <Input style={{border: "none"}}
            placeholder="Search" 
            value={this.state.searchDeck} 
            onChange={this.updateSearchDeck.bind(this)}
          />
          {this.state.currentPermissionLevel === 'su'
          ? 
            <InputGroupAddon addonType="append">
                <Button style={{backgroundColor:'#3e6184'}} onClick={() => this.setOpenForm(2)}> Add Module </Button>
            </InputGroupAddon>
          : null}
          {this.state.currentPermissionLevel === 'pf' || this.state.currentPermissionLevel === 'ta'
          ? 
            <InputGroupAddon addonType="append">
              <ButtonDropdown isOpen={this.state.addModuleButtonOpen} toggle={this.toggleAddModuleButton}>
                <DropdownToggle style={{backgroundColor:'#3e6184', borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px"}} caret>
                  Add Module
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => this.setOpenForm(1)}> Add Existing </DropdownItem>
                  <DropdownItem onClick={() => this.setOpenForm(2)}> Add New </DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            </InputGroupAddon>
          : null}
        </InputGroup>
      <br />
      {/*Form for adding an existing Module*/}
      <Modal isOpen={this.state.openForm === 1} toggle={() => this.setOpenForm(1)}>
          <ModalHeader toggle={() => this.setOpenForm(1)}>Existing Modules</ModalHeader>
          <ModalBody style={{padding: "0 20px 30px 20px"}}>
            <AddExistingModule 
              serviceIP={this.props.serviceIP} 
              updateModuleList={this.updateModuleList}
              classOptions={classOptions}
              currentClass={this.state.selectedClass}
            />
          </ModalBody>
      </Modal>

      {/*Form for adding a new Module*/}
      <Collapse isOpen={this.state.openForm === 2}>    
        <AddModule  
          serviceIP={this.props.serviceIP} 
          permissionLevel={this.state.currentPermissionLevel}
          updateModuleList={this.updateModuleList}
          classOptions={classOptions}
          currentClass={this.state.selectedClass}
        />  
      </Collapse>

        <Row>
          <Col>
          {this.state.currentPermissionLevel === "st" ?
            <StudentView 
              currentPermissionLevel={this.state.currentPermissionLevel}
              modules={this.state.dynamicModules}
              updateCurrentModule={this.updateCurrentModule}
            /> 
          : null }
          {this.state.currentPermissionLevel === "pf" || this.state.currentPermissionLevel === "ta" ?
            <AdminView 
              currentPermissionLevel={this.state.currentPermissionLevel}
              modules={this.state.dynamicModules}
              updateCurrentModule={this.updateCurrentModule}
              deleteModule={this.deleteModule}
              editModule={this.editModule}
              unlinkModule={this.unlinkModule}
            /> 
          : null }
          {this.state.currentPermissionLevel === "su" ?
            <SuperAdminView 
              currentPermissionLevel={this.state.currentPermissionLevel}
              modules={this.state.dynamicModules}
              updateCurrentModule={this.updateCurrentModule}
              deleteModule={this.deleteModule}
              editModule={this.editModule}
            /> 
          : null }
          </Col>
        </Row>
      </Col>
      <Col className="Right Column">
        <Row>
          <Col>

            {/*Either the contents of current module, or alert saying there are no modules*/}
            {
              this.state.currentModule.length !== 0 ? 
                <Deck
                  permissionLevel={this.state.currentPermissionLevel}
                  currentClass={this.state.selectedClass}
                  curModule={this.state.currentModule}
                  cards={this.state.cards}
                  serviceIP={this.props.serviceIP}
                  updateCurrentModule={this.updateCurrentModule}
                  allAnswers={this.state.allAnswers}
                  modificationWarning={this.state.modificationWarning}
                  toggleModificationWarning={this.toggleModificationWarning}
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
