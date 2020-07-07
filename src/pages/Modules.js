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
    this.deleteDeck = this.deleteDeck.bind(this);
    this.dRef = React.createRef();
    this.mRef = React.createRef(); 
    this.state = {
      userID: "",
      username: "",

      modules: [],

      dynamicModules: [],

      audio: [],
      image: [],

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
      console.log(this.dRef);
      this.updateModules(); 
  }

  updateModules() {
    console.log("updating Modules"); 
    axios.get(this.props.serviceIP + '/modules', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }).then(res => {
      console.log(res.data);
      let modules = res.data; 
      this.setState({ modules : modules,
                      dynamicModules: modules });

      if (this.state.modules.length === 0) {
        this.toggleEmptyCollectionAlert(); 
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  deleteDeck(e) {
    e.preventDefault();
    var data = {
      deckID: this.state.deckID,
    }
    var headers = {
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    }
    axios.delete(this.props.serviceIP + '/deck', data, {headers:headers})
    .then(res => {
      console.log(res.data);
    }).catch(function (error) {
      console.log(error);
    });
  }

  // submitDeck(e) {
  //   e.preventDefault();
  //   var data = {
  //     deckName: this.state.deckName,
  //     ttype: this.state.ttype,
  //   }
  //   var headers = {
  //     'Authorization': 'Bearer ' + localStorage.getItem('jwt')
  //   }
  //   axios.post(this.props.serviceIP + '/deck', data, {headers:headers})
  //   .then(res => {
  //     console.log(res.data);
  //   }).catch(function (error) {
  //     console.log(error);
  //   });
  // }

  change(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  updateSearchDeck(e) {
    //this.setState({ searchDeck: e.target.value.substr(0,20) });

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
    console.log("rendering Decks page");
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
          <AddModule serviceIP={this.props.serviceIP} ref={this.mRef}></AddModule>
        </Collapse>
        <Row>
          <Col>
            <Card color="info" style={{overflow:"scroll", height:"65vh"}}>
              {
                this.state.dynamicModules.map((deck, i)=> (
                  <SplitDeckBtn key={i} curDeck={deck} ref={this.dRef}></SplitDeckBtn>
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
              ref={this.dRef}
              id={this.state.modules[0].moduleID}
              deck={this.state.modules[0]}
              deckName={this.state.modules[0].name}
              serviceIP={this.props.serviceIP}>
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
