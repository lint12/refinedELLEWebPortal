import React, { Component, Fragment } from 'react';
import { Container, Table, Row, Col, Input, Button, Card,
  InputGroup, InputGroupAddon, Modal, ModalHeader, ModalBody, Alert } from 'reactstrap';
import ListGroup from 'react-bootstrap/ListGroup'
import Tab from 'react-bootstrap/Tab'
import Select from 'react-select';
import axios from 'axios';
import '../stylesheets/style.css';

import Template from './Template';
import AccessDenied from './AccessDenied'; 
import Class from './../components/ClassRoster/Class'; 

class ClassRoster extends Component {

  constructor(props) {
    super(props)
    this.state = {
      students: [],
      tas: [],
      groups: [], 
      currentGroup: "st",
      search : "",
      elevateModalOpen: false,
      selectedClass: '',
      selectedUser: '', 
    }
  }    

  componentDidMount() {
    this.getGroups(); 
  }

  change(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  updateSearch(e) {
    this.setState({ search: e.target.value.substr(0,20) });
  }

  getGroups = () => {
    axios.get(this.props.serviceIP + '/searchusergroups', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }).then(res => {
      console.log(res.data);

      this.setState({
        groups: res.data
      });
    }).catch(function (error) {
      console.log(error);
    });
  }

  toggleElevateModal = () => {
    this.setState({
      elevateModalOpen: !this.state.elevateModalOpen,
    })
  }

  updateSelectedUser = (value) => {
    this.setState({
      selectedUser: value
    })
  }

  updateSelectedClass = (value) => {
    this.setState({
      selectedClass: value
    })
  }

  elevateUser = (group) => {
    var data = {
      userID: this.state.selectedUser.value,
      accessLevel: group, 
      groupID: this.state.selectedClass.value
    }
    console.log(data);
    var headers = {
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    }

    axios.post(this.props.serviceIP + '/elevateaccess', data, {headers:headers})
    .then(res => {
      console.log(res.data);
      this.toggleElevateModal(); 
      this.getGroups(); 
    }).catch(function (error) {
      console.log(error);
    });
  }

  renderUserTable = (group) => {
    let classes = []; 
    let students = []; 
    let classOptions = this.state.groups.map((group) => { return ({value: group.groupID, label: group.groupName}) });
    let nonTAList = []; 
    let searchLength = 11; 
    let addButton = (     
      <Col sm={1} style={{paddingLeft: "5px"}}>
        <Button style={{borderRadius: "30px"}} onClick={() => this.toggleElevateModal()}>
          <img 
            src={require('../Images/plus.png')} 
            alt="Icon made by srip from www.flaticon.com"
            style={{width:"15px", height:"15px"}}
          />
        </Button>
      </Col>
    );

    console.log("CLASS OPTIONS: ", classOptions); 

    let classColors = this.getColors();

    if (group === "ta") {
      this.state.groups.map((group, i) => {classes.push(
        {
          groupID: group.groupID,
          groupName: group.groupName, 
          groupColor: classColors[i],
          group_users: group.group_users.filter((user) => {return user.accessLevel === 'ta'})
        }
      )});
    }
    else {
      this.state.groups.map((group, i) => {classes.push(
        {
          groupID: group.groupID,
          groupName: group.groupName, 
          groupColor: classColors[i],
          group_users: group.group_users.filter((user) => {return user.accessLevel === 'st'})
        }
      )});
      searchLength = 12; 
      addButton = null; 
    }

    console.log("CLASSES: ", classes);

    if (this.state.currentGroup === "ta") {
      this.state.groups.map((group) => group.group_users.filter(
        (user) => user.accessLevel === "st" 
        ? students.push({
          userID: user.userID, username: user.username, 
          groupID: group.groupID, groupName: group.groupName
        }) 
        : null)
      ); 
      console.log("STUDENTS: ", students);
    }

    let filteredClass = classes.filter(
      (group) => { 
          return (group.groupName.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1);
      }
    ); 

    return (
      <>
      <Row>
        <Col sm={searchLength}>
          <InputGroup style={{borderRadius: "8px"}}>
            <InputGroupAddon addonType="prepend" style={{margin: "10px"}}>
              <img 
                src={require('../Images/search.png')} 
                alt="Icon made by Freepik from www.flaticon.com" 
                style={{width: '20px', height: '20px'}}
              />
            </InputGroupAddon>
            <Input style={{border: "none"}}
              type="text" 
              placeholder="Search for a class" 
              value={this.state.search} 
              onChange={this.updateSearch.bind(this)}
            />
          </InputGroup>
        </Col>
        {addButton}
      </Row>
      <br />
        {filteredClass.map(
          (group, i) => { 
            return (
                <Class key={i} group={group} currentGroup={this.state.currentGroup} groupColor={group.groupColor} />
            )
          }
        )}
      <Modal isOpen={this.state.elevateModalOpen} toggle={() => this.toggleElevateModal()} backdrop={true}>
        <ModalHeader toggle={() => this.toggleElevateModal()}>Modify Permission</ModalHeader>
        <ModalBody>
          Class: 
          <Select
            name="class"
            options={classOptions}
            className="basic-single"
            classNamePrefix="select"
            isClearable={true}
            value={this.state.selectedClass}
            onChange={this.updateSelectedClass}
          />
          Select a student to promote them to TA privileges: 
          <Select
            isDisabled={this.state.selectedClass === null || this.state.selectedClass === '' ? true : false}
            name="nonTAList"
            options={this.state.selectedClass === null ? null 
            : students.filter((student) => student.groupID === this.state.selectedClass.value).map((user) => {return ({value: user.userID, label: user.username})}) }
            className="basic-single"
            classNamePrefix="select"
            isClearable={true}
            value={this.state.selectedUser}
            onChange={this.updateSelectedUser}
          />
          <br />
          <Button block onClick={() => this.elevateUser("ta")}>Elevate</Button>
        </ModalBody>
      </Modal>
      </>
    )
  }

  getColors = () => {
    let possibleColors=['#a5d5f6', "cornflowerblue", '#57baca', '#48a5b7']

		let colorList = [];
		let index = 0;

		for(let i = 0; i < this.state.groups.length; i++){
			colorList.push(possibleColors[index]);
			
			index++;
			
			if(index >= possibleColors.length){
				index = 0;
			}
    }
    
    return colorList;
  }

  resetVal = (k) => {
    let group = ""; 
    if (k === "#students") {
      group = "st"; 
    }
    else if (k === "#tas") {
      group = "ta"; 
    } 

    this.setState({
      search: "", 
      currentGroup: group
    })
  }

  render() {
    if (localStorage.getItem('per') === "su" || localStorage.getItem('per') === "st") {
      return (
        <Container>
          <Template/>
          <br></br>
          <AccessDenied message={localStorage.getItem('per') === "su" ? "Information Not Valid" : "Access Denied :("} />
        </Container>
      )
    }
    return (
      <Container className="user-list">
        <Template/>
        <br></br><br></br>			
        <div>
        <h3>Class Roster</h3>
          <Tab.Container id="userList" defaultActiveKey="#students" onSelect={(k) => this.resetVal(k)}>
            <Row>
              <Col sm={4}>
                <ListGroup className="userListTabs">
                  <ListGroup.Item action href="#students">
                    Students
                  </ListGroup.Item>
                  <ListGroup.Item action href="#tas">
                    TAs
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col sm={8}>
                <Tab.Content>
                  <Tab.Pane eventKey="#students">
                    {this.renderUserTable("st")}
                  </Tab.Pane>
                  <Tab.Pane eventKey="#tas">
                    {this.renderUserTable("ta")}
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      </Container>
    )
  }
}

export default ClassRoster
