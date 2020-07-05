import React, { Component, useState } from 'react';
import { Collapse, Button, ButtonGroup, Card, Form, FormGroup, Label, Input, InputGroup,
   InputGroupAddon, InputGroupText, Container, Row, Col, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import axios from 'axios';
  
import AddTerm from '../components/Decks/AddTerm';
import AddModule from '../components/Decks/AddModule';
import AddQuestion from '../components/Decks/AddQuestion';
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
    this.updateSearch = this.updateSearch.bind(this);

    this.dRef = React.createRef(); //ref for updating current deck to selected deck
    this.ncRef = React.createRef(); //ref for setting new card form to current deck
    
    this.state = {
      search: '', //search field for cards in a deck
      searchDeck: '', //search field for decks in deck menu
      
      collapseNewModule: false, //determines whether new module form is collapsed
      collapseNewCard: false, //determines whether new card form is collapsed
      
      deckID: "", //the ID of the deck we are currently looking at
      currentDeckName: "", //the name of the deck we are currently looking at

      deckName: "", //name of deck we're submitting
      ttype: "", // ttype of deck we're submitting, currently has no input

      decks: [], // array of decks, used for deck menu. Format: [{id: id, name: name}]
      dynamicDecks: [], //array of decks that changes based on search field inputs
      


      //all state elements below this point are unused in this module
      userID: "",
      username: "",

      front: "",
      back: "",
      cardName: "",
      difficultly: 1,
      gifLocation: null,

      cards: [],
      audio: [],
      image: [],
    };
  }

  componentDidMount() {

      axios.get(this.props.serviceIP + '/decks', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
      }).then(res => {
        let decks = res.data['ids'].map((id, i)=>{
          return {id: id, name: res.data['names'][i]};
        });
        console.log("DECKS: ", decks);
        this.setState({
          decks : decks,
          dynamicDecks: decks
        });
      }).catch(function (error) {
        console.log("Decks.componentDidMount: " error);
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

  //TODO: make work with current database
  //function for deleting a deck
  deleteDeck(id) {
    var data = {
      moduleID: id
    }

    var headers = {
    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    }

    axios.delete(this.props.serviceIP + '/module', data, {headers:headers})
    .then(res => {
      console.log(res.data);
    }).catch(function (error) {
      console.log(error);
    });
  }

  //TODO: make work with current database
  //Submits deck created by the add deck form
  submitDeck(e) {
    e.preventDefault();

    var data = {
      deckName: this.state.deckName,
      ttype: this.state.ttype,
    };

    var headers = {
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    };

    axios.post(this.props.serviceIP + '/deck', data, {headers:headers})
    .then(res => {
      console.log(res.data);
    }).catch(function (error) {
      console.log(error);
    });
  }


  //This method is unused in this module
  change(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  //updates search field for cards, unused since search field was moved to Deck.js component
  updateSearch(e) {
    this.setState({ search: e.target.value.substr(0,20) });
  }

  //updates search field for decks in deck menu
  updateSearchDeck = (e) => {

    let filterFunction = (deck) =>{
      let deckName = deck.name;
      let namePrefix = deckName.substr(0,e.target.value.length);
      if(namePrefix.toLowerCase() === e.target.value.toLowerCase()){
        return true;
      } else{
        return false;
      }
    }
    
    let newDeckList = this.state.decks.filter(filterFunction);

    this.setState({ searchDeck: e.target.value.substr(0,20),
                    dynamicDecks: newDeckList});
  }

  //toggles whether or not new module form is collapsed
  toggleNewModule() {
    this.setState({ collapseNewModule: !this.state.collapseNewModule });
  }

  //toggles whether or not new card form is collapsed
  toggleNewCard() {
    this.setState({ collapseNewCard: !this.state.collapseNewCard });
  }

  //component that returns an entry into the deck menu
  //name: name of deck. curDeck: object of {id: id, name: name}
  SplitDeckBtn = ({curDeck}) => {
    const [dropdownOpen, setOpen] = useState(false);
  
    const toggle = () => setOpen(!dropdownOpen);
    return (
      <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>

        {/* button that, when clicked, updates the current deck to the element that was clicked,
         and updates what deck the addCard form points to*/}
        <Button id="caret" 
          style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}} 
          id="deckButton" onClick={ () => {
            this.dRef.current.updateDeck({ deck: curDeck })
            this.setState({ deckID: curDeck.id,
                            currentDeckName: curDeck.name})
          }}> {curDeck.name} </Button>

        <DropdownToggle caret color="info"/>

        {/*mini menu that allows users to delete or edit a deck from this button*/}
        <DropdownMenu style={{minWidth: '50px', padding: '0px', backgroundColor: 'gray'}}>
            <DropdownItem style={{padding: '4px 24px 4px 10px', backgroundColor: 'lightcyan', color: 'black', outline: 'none'}}>
              <img src={"./../../../tools.png"} alt="edit icon" style={{width: '18px', height: '18px'}}/> Edit</DropdownItem>
            <DropdownItem style={{padding: '4px 24px 4px 10px', backgroundColor: 'lightcoral', color: 'black', outline: 'none'}}>
              <Button onClick = {this.deleteDeck(curDeck.id)}>
                <img src={"./../../../delete.png"} alt="trash can icon" style={{width: '18px', height: '20px'}}/>
                Delete
              </Button>
            </DropdownItem>
        </DropdownMenu>

      </ButtonDropdown>
    );
  }

  render() {
    return (
    <Container>
      <Template/>

      <br/><br/>

      <Row className="Seperated Col">

        {/*Column on left side of page, contains deck menu, search field for deck menu,
          and the add deck button and form*/}
        <Col className="Left Column" xs="3">

          <h4>Your Elle VR Modules:</h4>

          {/*search field for deck menu, and button for adding a deck*/}
          <InputGroup style={{borderRadius: '12px'}}>        
            
            <Input placeholder="Search" value={this.state.searchDeck} onChange={this.updateSearchDeck}/>
            
            <InputGroupAddon addonType="append">
              <Button style={{backgroundColor:'#3e6184'}} onClick={this.toggleNewModule}>Add Module</Button>
            </InputGroupAddon>
          </InputGroup>

          <br></br>

          {/*form for adding a module, button above determines whether or not it's visible*/}
          <Collapse isOpen={this.state.collapseNewModule}>
            <AddModule />
          </Collapse>

          <Row>
            <Col>
              
              {/*Creates the deck menu by going over this.state.dynamicDecks, and for each
              element in the array, it returns a splitDeckBtn component*/}
              <Card color="info" style={{overflow:"scroll", maxHeight:"65vh"}}>
                {

                  this.state.dynamicDecks.map((deck)=> <this.SplitDeckBtn key={deck.id} curDeck={deck} />)
                    
                }
              </Card>

            </Col>
          </Row>
        </Col>


        {/*Column on right side of page, and takes up most of the page. 
        Contains the deck currently being displayed, a search field for cards in the deck,
        and a form for adding a card to the deck*/}
        <Col className="Right Column">
          {/*This form was moved to the Deck.js component, so it could adapt to the decktype better*/}
          {/*Only show the form if there is a deck selected*/}
        {/*
          <Collapse isOpen={this.state.deckID != ""}>
            <InputGroup style={{borderRadius: '12px'}}>
              
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>{this.state.currentDeckName}</InputGroupText>
                </InputGroupAddon>

                <Input placeholder="Search" value={this.state.search} onChange={this.updateSearch}/>

                <InputGroupAddon addonType="append">
                  <Button style={{backgroundColor:'#3e6184'}} onClick={this.toggleNewCard}>Add Term</Button>
                </InputGroupAddon>
              
            </InputGroup>
          </Collapse>
          */}

          <Row>
            <Col>
              {/*This Form was moved to the Deck.js component, so it could adapt to the decktype better*/}
              {/*Form for adding term, button above determines if its visible*/}
              {/*
              <Collapse isOpen={this.state.collapseNewCard}>
                
                <AddTerm
                  ref={this.ncRef}
                  id={this.state.deckID}
                  serviceIP={this.props.serviceIP} />

              </Collapse>
              */}

              <br/>

              {/*Deck component for the deck we're currently looking at*/}
              {/*Has a ref so we can access the updateDeck function, which is in that component for some reason*/}
              <Deck
                ref={this.dRef}
                id={this.state.deckID}
                deck={this.state.decks.find((a) => a.id === this.state.deckID)}
                serviceIP={this.props.serviceIP} />

              <br/><br/>
              
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
    )
  }
}
