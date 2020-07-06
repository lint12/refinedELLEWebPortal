import React from 'react';
import { Container, Row, Col, Media, Collapse, Input, 
        InputGroup, InputGroupAddon, InputGroupText, Button } from 'reactstrap';
import CardList from './CardList';
import AddTerm from './AddTerm';
import AddQuestion from './AddQuestion';
import AddPhrase from './AddPhrase';
import axios from 'axios';

class Deck extends React.Component {
  constructor(props) {
    super(props);
    this.change = this.change.bind(this);
    this.submit = this.submit.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.toggleNewCard = this.toggleNewCard.bind(this);
    this.willlRenderSearchBar = this.willRenderSearchBar.bind(this);
    this.renderSearchBar = this.renderSearchBar.bind(this);
    this.renderInputForm = this.renderInputForm.bind(this);
    //this.willRenderCardList = this.willRenderCardList.bind(this);

    this.state = {
      deck: this.props.deck, //object of the deck we're looking at, formatted: {id: id, name: name}
      id: this.props.id, //id of the deck we're looking at
      search: "", //what is in the search field in the search bar
      collapseNewCard: false, //whether or not the new card form is visible

      //list of cards in the deck we're looking at, properties: {audioLocation, back, cardID,
      //cardName, deckID, difficulty, front, gifLocation, imageLocation, tag
      cards: [],
      termCards: [],

      dynamicCards: [],

      //all state elements below this point are unused in this module
      cardID: '',
      deckName: '',
      ttype: "",
      
    };

  }

  //TODO: adapt to current database
  //updates the deck we're looking at, and pulls the list of cards from the server.
  //THIS VERSION IS FOR CURRENT DATABASE
/*
  updateDeck(e) {
    console.log("tttt");
    console.log("E.MODULE.ID.MODULEID: ", e.module.id.moduleID);
    axios.get(this.props.serviceIP + '/module?moduleID=' + e.module.id.moduleID, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
    }).then( res => {
      console.log("res.data: ", res.data);
      console.log("e.deck: ", e.module);
      let cards = res.data;
      this.setState({
        id: e.module.moduleID,
        deck:e.module,
        cards: cards,
        dynamicCards: cards
      });
    }).catch(function (error) {
      console.log(error);
    });
  }
*/

  //THIS VERSION IS FOR THE OLD DATABASE
  updateDeck(e) {
    console.log("tttt");
    console.log("E.DECK.MODULEID: ", e.deck.moduleID);
    console.log("E.DECK: ", e.deck);

    axios.post(this.props.serviceIP + '/modulequestions', { moduleID: e.deck.moduleID,
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }).then( res => {
      console.log("updateDeck RES.DATA: ", res.data);
      let cards = res.data;
      console.log("CARDS OBJECT: ", cards);
      this.setState({
        id: e.deck.moduleID,
        deck:e.deck,
        cards: cards,
        dynamicCards: cards,
        termCards: cards.filter((card) => card.type === "MATCH").map((card, i) => {return card.answers[0]})
      });
    console.log("ID: ", this.state.id);
    console.log("DECK_updateDeck: ", this.state.deck);
    console.log("CARDS: ", this.state.cards);
    console.log("TERM CARDS: ", this.state.termCards);
    }).catch(function (error) {
      console.log("ERROR: ", error);
    });

  }

  //function is no longer used
  change(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  //function is no longer used. Process of submitting cards has been put in other components
  submit(e) {
      e.preventDefault();
      var data = {
        cardID: this.state.cardID,
      }
      var headers = {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
      axios.delete(this.props.serviceIP + '/card', data, {headers:headers
      }).then(res => {
        console.log(res.data);
      }).catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
      /*axios.get(this.props.serviceIP + '/deck/' +this.state.id, {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
      }).then(res => {
          console.log(res.data);
          this.setState({
            cards : res.data });
        }).catch(function (error) {
          console.log(error);
        });
        */
        console.log( this.state.deck);
  }

  //updates the search field in the search bar above the deck
  updateSearch = (event) => {
    this.setState({ search: event.target.value.substr(0,20) });
  }

  //toggles whether the new card form appears
  toggleNewCard = () => {
    this.setState({ collapseNewCard: !this.state.collapseNewCard});
  }

  //determines whether we will render the search bar at all. Needed so we don't try to render 
  //for a nonexistent deck, which causes an error
  willRenderSearchBar = () => {
    if(this.state.deck == null){
      return false;
    } else{
      return true;
    }
  }

  //renders the search bar in question. It's slightly different depending on the type of deck it is
  //TODO: This no longer reflects the current database. Change it so that it's one search bar with
  //three buttons
  renderSearchBar = () => {
    if(this.willRenderSearchBar() == false){
      return;
    } else{
      
      if(this.state.deck.type == "question"){
        return(<Collapse isOpen={this.willRenderSearchBar()}>
          <InputGroup style={{borderRadius: '12px'}}>
            
              <InputGroupAddon addonType="prepend">
                <InputGroupText>{this.renderDeckName()}</InputGroupText>
              </InputGroupAddon>

              <Input placeholder="Search" value={this.state.search} onChange={this.filterCards}/>

              <InputGroupAddon addonType="append">
                <Button style={{backgroundColor:'#3e6184'}} onClick={this.toggleNewCard}>Add Question</Button>
              </InputGroupAddon>
            
          </InputGroup>
          <br/>
        </Collapse>);
      }

      if(this.state.deck.type == "phrase"){
        return(<Collapse isOpen={this.willRenderSearchBar()}>
          <InputGroup style={{borderRadius: '12px'}}>
            
              <InputGroupAddon addonType="prepend">
                <InputGroupText>{this.renderDeckName()}</InputGroupText>
              </InputGroupAddon>

              <Input placeholder="Search" value={this.state.search} onChange={this.filterCards}/>

              <InputGroupAddon addonType="append">
                <Button style={{backgroundColor:'#3e6184'}} onClick={this.toggleNewCard}>Add Phrase</Button>
              </InputGroupAddon>
            
          </InputGroup>
          <br/>
        </Collapse>);

      }

      if(this.state.deck.type == "term"){
        return(<Collapse isOpen={this.willRenderSearchBar()}>
          <InputGroup style={{borderRadius: '12px'}}>
            
              <InputGroupAddon addonType="prepend">
                <InputGroupText>{this.renderDeckName()}</InputGroupText>
              </InputGroupAddon>

              <Input placeholder="Search" value={this.state.search} onChange={this.filterCards}/>

              <InputGroupAddon addonType="append">
                <Button style={{backgroundColor:'#3e6184'}} onClick={this.toggleNewCard}>Add Term</Button>
              </InputGroupAddon>
            
          </InputGroup>
          <br/>
        </Collapse>);

      }
    }
  }

  //renders the input form for the deck. The type of form is determined by the type of deck
  //TODO: this no longer reflects how the current database works. Change it so that it renders
  //the proper input form based on which button was clicked
  renderInputForm = () => {
    if(this.willRenderSearchBar() == false){
      return;
    } else{
      
      if(this.state.deck.type == "question"){
        return(
          <AddQuestion
              id={this.getDeckID()}
              serviceIP={this.props.serviceIP} />
        );
      }

      if(this.state.deck.type == "phrase"){
        return(
          <AddPhrase
              id={this.getDeckID()}
              serviceIP={this.props.serviceIP} />
        );
      }

      if(this.state.deck.type == "term"){
        return(
          <AddTerm
              id={this.getDeckID()}
              serviceIP={this.props.serviceIP} />
        );
      }    
    }
  }

  //renders the name of the deck. Needed so we don't try to access a name of a deck that doesn't exist,
  //which returns an error
  renderDeckName = () => {
    if(this.state.deck == null){
      return;
    } else{
      return this.state.deck.name;
    }
  }

  //returns the id of the deck we're using. Needed so we don't try to access the id of a deck that doesn't
  //exist, which returns an error
  getDeckID = () => {
    if(this.state.deck == null){
      return;
    } else{
      return this.state.deck.id;
    }
  }

  //TODO: make sure that this works with every type of question. Might need to make a different filter
  //function for each type of question
  //filters through all of the cards in the deck, and only returns those that match the search field
  filterCards = (event) => {
    
    let filterFunction = (card) => {  
      let filterField = card.front;
      let filterFieldPrefix = filterField.substr(0,event.target.value.length);
      
      if(filterFieldPrefix.toLowerCase() == event.target.value.toLowerCase()){
        return true;
      } else{
        return false;
      }
    }

    let newCards= this.state.cards.filter(filterFunction);
    this.setState({search: event.target.value,
                  dynamicCards: newCards})
  }

  willRenderCardList = ({cards}) => {
    console.log("cards in willRenderCardList: ", cards);
    if(cards != undefined && cards != null){
      return(<CardList
          type = {this.willRenderSearchBar() ? this.state.deck.type : ""}
          cards = {this.state.termCards}
          />);
    } else{
      return;
    }
  }

  render () {
      return (
        <div>
          {/*TODO: delete this and replace it with object returned by renderSearchBar, after hooked up to database*/}
          {/*Search bar for filtering through the deck, and a button to open up new item form*/}
          <Collapse isOpen={this.willRenderSearchBar()}>
            <InputGroup style={{borderRadius: '12px'}}>
              
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>{this.renderDeckName()}</InputGroupText>
                </InputGroupAddon>

                <Input placeholder="Search" value={this.state.search} onChange={this.filterCards}/>

                <InputGroupAddon addonType="append">
                  <Button style={{backgroundColor:'#3e6184'}} onClick={this.toggleNewCard}>Add Term</Button>
                </InputGroupAddon>
              
            </InputGroup>
            <br/>
          </Collapse>

          {/*TODO: delete this and replace it with object returned by renderInputForm, after hooked up to database*/}
          {/*Form for adding term, button above determines if its visible*/}
          <Collapse isOpen={this.state.collapseNewCard}>
            
            <AddTerm
              id={this.getDeckID()}
              serviceIP={this.props.serviceIP} />

          </Collapse>
          <Container className='Deck'>


        {/*
          <Row className='Header'>
            <Col>
              <Media body>
                <Media heading />
              </Media>
            </Col>
          </Row>
        */}


          {/*Renders the list of cards in the deck, based on type of deck we're using.*/}
          {this.willRenderCardList(this.state.termCards)}

          {/* <Row>
            <Col>
              <Form inline onSubmit={e => this.submit(e)}>
                <Label for="cardID" className="mr-sm-2">Card ID:</Label>
                <Input type="text" name="cardID"
                onChange={e => this.change(e)}
                value={this.state.cardID}
                id="username" placeholder="Username"
                style={{width: '75%', marginRight: '8px'}}/>
                <Button color="danger" type="submit">Delete Card</Button>
              </Form>
            </Col>
          </Row> */}
          <Row>
            <br/>
          </Row>
        </Container>
        </div>
      );
    };
  }

export default Deck
