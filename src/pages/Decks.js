import React, { Component, useState } from 'react';
import { Collapse, Button, ButtonGroup, Card, Form, FormGroup, Label, Input, InputGroup,
   InputGroupAddon, InputGroupText, Container, Row, Col, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import axios from 'axios';
  
import AddCard from '../components/Decks/AddCard';
import AddModule from '../components/Decks/AddModule';
import Deck from '../components/Decks/Deck';
import Template from '../pages/Template';

import '../stylesheets/style.css';
import '../lib/bootstrap/css/bootstrap.min.css';
import '../lib/font-awesome/css/font-awesome.min.css';
import '../lib/owlcarousel/assets/owl.carousel.min.css';
import '../lib/ionicons/css/ionicons.min.css';

export default class Decks extends Component {
  constructor(props) {
    super(props);
    this.toggleNewModule = this.toggleNewModule.bind(this);
    this.toggleNewCard = this.toggleNewCard.bind(this);
    this.change = this.change.bind(this);
    this.deleteDeck = this.deleteDeck.bind(this);
    this.state = {
      search: '',
      searchDeck: '',
      collapseNewModule: false,
      collapseNewCard: false,
      deckID: "",
      userID: "",
      username: "",

      front: "",
      back: "",
      cardName: "",
      difficultly: 1,
      gifLocation: null,

      deckName: "",
      ttype: "",
      decks: [],
      cards: [],
      audio: [],
      image: [],
    };
  }

  componentDidMount() {
      axios.get(this.props.serviceIP + '/decks', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
      }).then(res => {
        console.log(res.data);
        let decks = res.data['ids'].map((id, i)=>{
          return {id: id, name: res.data['names'][i]};
        });
        this.setState({
          decks : decks
        });
      }).catch(function (error) {
        console.log(error);
      });
    }

  // deleteDeck(e) {
  //   e.preventDefault();
  //   var data = {
  //     deckID: this.state.deckID,
  //   }
  //   var headers = {
  //     'Authorization': 'Bearer ' + localStorage.getItem('jwt')
  //   }
  //   axios.delete(this.props.serviceIP + '/deck', data, {headers:headers})
  //   .then(res => {
  //     console.log(res.data);
  //   }).catch(function (error) {
  //     console.log(error);
  //   });
  // }

  deleteDeck(id) {

  }

  submitDeck(e) {
    e.preventDefault();
    var data = {
      deckName: this.state.deckName,
      ttype: this.state.ttype,
    }
    var headers = {
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    }
    axios.post(this.props.serviceIP + '/deck', data, {headers:headers})
    .then(res => {
      console.log(res.data);
    }).catch(function (error) {
      console.log(error);
    });
  }

  change(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  updateSearch(e) {
    this.setState({ search: e.target.value.substr(0,20) });
  }

  updateSearchDeck(e) {
    this.setState({ searchDeck: e.target.value.substr(0,20) });
  }

  toggleNewModule() {
    this.setState({ collapseNewModule: !this.state.collapseNewModule });
  }

  toggleNewCard() {
    this.setState({ collapseNewCard: !this.state.collapseNewCard });
  }

  SplitDeckBtn = ({name, curDeck}) => {
    const [dropdownOpen, setOpen] = useState(false);
  
    const toggle = () => setOpen(!dropdownOpen);

    return (
      <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
        <Button id="caret" 
          style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}} 
          id="deckButton" onClick={ () => {
            this.dRef.updateDeck({ deck: curDeck })
            this.ncRef.updateDeckID(curDeck.id)
            this.setState({ deckID: curDeck.id})
        }}>{name}</Button>
        <DropdownToggle caret color="info"/>
        <DropdownMenu style={{minWidth: '50px', padding: '0px', backgroundColor: 'gray'}}>
            <DropdownItem style={{padding: '4px 24px 4px 10px', backgroundColor: 'lightcyan', color: 'black', outline: 'none'}}>
              <img src={"./../../../tools.png"} alt="edit icon" style={{width: '18px', height: '18px'}}/> Edit</DropdownItem>
            <DropdownItem style={{padding: '4px 24px 4px 10px', backgroundColor: 'lightcoral', color: 'black', outline: 'none'}}>
              <img src={"./../../../delete.png"} alt="trash can icon" style={{width: '18px', height: '20px'}}/> Delete</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }

  render() {
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
          <AddModule></AddModule>
        </Collapse>
        <Row>
          <Col>
            <Card color="info" style={{overflow:"scroll", height:"65vh"}}>
              {
                this.state.decks.map((deck)=> (
                  <this.SplitDeckBtn name={deck.name} curDeck={deck}></this.SplitDeckBtn>
                ))
              }
            </Card>
          </Col>
        </Row>
      </Col>
      <Col className="Right Column">
        <InputGroup style={{borderRadius: '12px'}}>
          <InputGroupAddon addonType="prepend"><InputGroupText>{this.deckName}</InputGroupText></InputGroupAddon>
          <Input placeholder="Search" value={this.state.search} onChange={this.updateSearch.bind(this)}/>
          <InputGroupAddon addonType="append"><Button style={{backgroundColor:'#3e6184'}} onClick={this.toggleNewCard}>Add Card</Button></InputGroupAddon>
        </InputGroup>
        <Row>
          <Col>
              <Collapse isOpen={this.state.collapseNewCard}>
                <AddCard
                  ref={ncRef => {this.ncRef = ncRef;}}
                  id={this.state.deckID}
                  serviceIP={this.props.serviceIP}>
                </AddCard>
              </Collapse>
              <br></br>
            <Deck
              ref={dRef => {
                this.dRef = dRef;
              }}
              id={this.state.deckID}
              deck={this.state.decks.find((a) => a.id === this.state.deckID)}
              serviceIP={this.props.serviceIP}>
            </Deck>
            <br></br><br></br>
          </Col>
        </Row>
      </Col>
    </Row>
    </Container>
    )
  }
}
