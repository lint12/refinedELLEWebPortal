import React from 'react'
import { Container, Row, Col, Input, InputGroup, InputGroupAddon, InputGroupText, Button, Collapse } from 'reactstrap';
import CardList from './CardList'
import axios from 'axios';

import AddTerm from './AddTerm';

class Deck extends React.Component {
  constructor(props) {
    super(props);
    this.change = this.change.bind(this);
    this.submit = this.submit.bind(this);
    this.toggleNewCard = this.toggleNewCard.bind(this);
    this.state = {
      id: this.props.id,
      deck: this.props.deck,
      deckName: this.props.deckName,
      language: "",
      ttype: "",

      cards: [],
      cardID: '',
      searchCard: '',
      collapseNewCard: false,
    };

  }

  componentDidMount() {
    console.log("component did mount " + this.state.id);
    console.log(this.props.serviceIP);

    axios.post(this.props.serviceIP + '/modulequestions', {  moduleID: this.state.id ,
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }).then(res => {
        console.log(res.data);
        this.setState({cards: res.data});
      }).catch(function (error) {
        console.log(error);
      });
  }

  updateDeck(e) {
    console.log("Updating the deck...");
    console.log(e.deck.moduleID);
    console.log(e.deck);
    axios.post(this.props.serviceIP + '/modulequestions', { moduleID: e.deck.moduleID, 
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }).then( res => {
      console.log(res.data);
      let cards = res.data;
      this.setState({
        id: e.deck.termID,
        deck: e.deck,
        deckName: e.deck.name,
        cards: cards
      });
      this.ncRef.updateDeckID(e.deck.termID); 
    }).catch(function (error) {
      console.log(error);
    });
  }

  updateSearchCard(e) {
    this.setState({ searchCard: e.target.value.substr(0,20) });
  }

  toggleNewCard() {
    this.setState({ collapseNewCard: !this.state.collapseNewCard });
  }

  change(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

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

  render () {
      console.log("rendering the deck")
      console.log("deckName: " + this.state.deckName);
      console.log("deck id: " + this.state.id);
      console.log("deck array: " + this.state.deck);
      console.log("cards array: " + this.state.cards);

      let terms = this.state.cards.filter(card => card.type === "MATCH").map((card, i) => {return card.answers[0]});
      
      console.log("terms: ", terms);

      let filteredTerms = terms.filter(
          (term) => { 
            if (term) 
              return term.front.toLowerCase().indexOf(this.state.searchCard.toLowerCase()) !== -1;
          }
      );
      return (
        <Container className='Deck'>
          <Row className='Header' style={{marginBottom: '25px'}}>
            <InputGroup style={{borderRadius: '12px'}}>
              <InputGroupAddon addonType="prepend"><InputGroupText>{this.state.deckName}</InputGroupText></InputGroupAddon>
              <Input type="text" placeholder="Search" value={this.state.searchCard} onChange={this.updateSearchCard.bind(this)}/>
              <InputGroupAddon addonType="append"><Button style={{backgroundColor:'#3e6184'}} onClick={this.toggleNewCard}>Add Card</Button></InputGroupAddon>
            </InputGroup>
            <Col>
            <Collapse isOpen={this.state.collapseNewCard}>
              <AddTerm
                ref={ncRef => {this.ncRef = ncRef;}}
                id={this.state.id}
                type={0}
                serviceIP={this.props.serviceIP}>
              </AddTerm>
            </Collapse>
            </Col>
          </Row>
            <CardList cards = {filteredTerms} serviceIP={this.props.serviceIP}/>
          <Row>
            <br/>
          </Row>
        </Container>
      );
    };
  }

export default Deck
