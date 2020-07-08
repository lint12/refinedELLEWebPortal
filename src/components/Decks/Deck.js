import React from 'react'
import { Container, Row, Col, Input, InputGroup, InputGroupAddon, InputGroupText, Button, Collapse } from 'reactstrap';
import CardList from './CardList'
import axios from 'axios';

import AddTerm from './AddTerm';

class Deck extends React.Component {
  constructor(props) {
    super(props);
    this.toggleNewCard = this.toggleNewCard.bind(this);
    this.getCurrentModuleContents = this.getCurrentModuleContents.bind(this);

    this.state = {
      id: this.props.id,
      module: this.props.module,
      deckName: this.props.deckName,
      language: "",
      ttype: "",

      cards: this.props.cards,
      cardID: '',
      searchCard: '',
      collapseNewCard: false,
    };

  }

  componentDidMount() {
    console.log("deck.js componentDidMount. this.state.module: ",  this.state.module);
    console.log("deck.js serviceIP: ", this.props.serviceIP);

    this.getCurrentModuleContents();
  }


  getCurrentModuleContents = () => {
    axios.post(this.props.serviceIP + '/modulequestions', {  moduleID: this.state.id ,
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }).then(res => {
        console.log(res.data);
        this.setState({cards: res.data});
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

  render () {

      console.log("rendering the module: ", this.state.module);
      console.log("deck.js module prop: ", this.props.module);
      console.log("deck.js, this.state.cards: ", this.state.cards, "this.props.cards: ", this.props.cards);

      let terms = this.props.cards.filter(card => card.type === "MATCH").map((card, i) => {return card.answers[0]});
      
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
