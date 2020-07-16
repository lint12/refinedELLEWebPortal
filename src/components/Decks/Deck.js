import React from 'react'
import { Container, Row, Col, Input, InputGroup, InputGroupAddon, InputGroupText, Button, Collapse, Card, CardHeader } from 'reactstrap';
import CardList from './CardList'
//import axios from 'axios';

import AddTerm from './AddTerm';

class Deck extends React.Component {
  constructor(props) {
    super(props);
    this.toggleNewCard = this.toggleNewCard.bind(this);
    this.toggleTab = this.toggleTab.bind(this); 

    this.state = {
      id: this.props.curModule.moduleID,
      name: this.props.curModule.name,
      language: "",

      searchCard: "",
      collapseNewCard: false,

      collapseTab: false,
      tabs: [0,1,2],
    };

  }

  componentDidMount() {
    console.log("deck.js serviceIP: ", this.props.serviceIP);
  }

  addTag = (tagList, tag) => {

    let tempTagList = tagList;
    tempTagList.push(tag);
    return tempTagList;
  }

  deleteTag = (tagList, tag) => {
    //TODO: create function that delete a tag from the database, given the tag
    //And pass that function into autocomplete


    let tempTagList = tagList;

    if(tempTagList === undefined){
      return;
    }

    let tagIndex = tempTagList.indexOf(tag);

    if(tagIndex != -1){
      tempTagList.splice(tagIndex, 1);
    }

    return tempTagList;

    
  }


  updateSearchCard(e) {
    this.setState({ searchCard: e.target.value.substr(0,20) });
  }

  toggleNewCard() {
    this.setState({ collapseNewCard: !this.state.collapseNewCard });
  }

  toggleTab(e) {
    let event = e.target.dataset.event; 
    this.setState({ collapseTab: this.state.collapseTab === Number(event) ? -1 : Number(event) })
  }

  render () {
      let terms = this.props.cards.filter(card => card.type.toLowerCase() === "match").map((card, i) => {return card.answers[0]});
      let phrases = this.props.cards.filter(card => card.type.toLowerCase() === "phrase").map((card, i) => {return card.answers[0]}); 
      let questions = this.props.cards.filter(card => card.type.toLowerCase() === "longform").map((card, i) => {return card.answers}); 
      
      console.log("terms: ", terms);
      console.log("phrases: ", phrases); 
      console.log("questions: ", questions); 

      let filteredTerms = terms.filter(
          (term) => { 
            if (term) 
              return ((term.front.toLowerCase().indexOf(this.state.searchCard.toLowerCase()) !== -1) || 
              (term.back.toLowerCase().indexOf(this.state.searchCard.toLowerCase()) !== -1));
            else 
              return null; 
          }
      );

      let filteredPhrases = phrases.filter(
        (phrase) => { 
          if (phrase) 
            return ((phrase.front.toLowerCase().indexOf(this.state.searchCard.toLowerCase()) !== -1) || 
            (phrase.back.toLowerCase().indexOf(this.state.searchCard.toLowerCase()) !== -1));
          else 
            return null; 
        }
     );

      return (
        <Container className='Deck'>
          <Row className='Header' style={{marginBottom: '25px'}}>
            <InputGroup style={{borderRadius: '12px'}}>
              <InputGroupAddon addonType="prepend"><InputGroupText>{this.props.curModule.name}</InputGroupText></InputGroupAddon>
              <Input type="text" placeholder="Search" value={this.state.searchCard} onChange={this.updateSearchCard.bind(this)}/>
              <InputGroupAddon addonType="append"><Button style={{backgroundColor:'#3e6184'}} onClick={this.toggleNewCard}>Add Card</Button></InputGroupAddon>
            </InputGroup>
            <Col>
            <Collapse isOpen={this.state.collapseNewCard}>
              <AddTerm
                id={this.state.id}
                type={0}
                serviceIP={this.props.serviceIP}
                deleteTag={this.deleteTag}
                addTag={this.addTag}>
              </AddTerm>
            </Collapse>
            </Col>
          </Row>
          {this.state.tabs.map((index,i) => { 
            if (index === 0) {
              return (
                <Card key={i} style={{ marginBottom: '1rem' }}>
                  <CardHeader onClick={this.toggleTab} data-event={index}>Terms</CardHeader>
                  <Collapse isOpen={this.state.collapseTab === index}>
                    <CardList cards = {filteredTerms} serviceIP={this.props.serviceIP} 
                    curModule={this.props.curModule} updateCurrentModule={this.props.updateCurrentModule}
                    deleteTag={this.deleteTag}/>
                  </Collapse>
                </Card>
              )
            }
            else if (index === 1) {
              return (
                <Card key={i} style={{ marginBottom: '1rem' }}>
                  <CardHeader onClick={this.toggleTab} data-event={index}>Phrases</CardHeader>
                  <Collapse isOpen={this.state.collapseTab === index}>
                    <CardList cards = {filteredPhrases} serviceIP={this.props.serviceIP}/>
                  </Collapse>
                </Card>
              )
            }
            else {
              return (
                <Card key={i} style={{ marginBottom: '1rem' }}>
                  <CardHeader onClick={this.toggleTab} data-event={index}>Questions</CardHeader>
                  <Collapse isOpen={this.state.collapseTab === index}>
                    {/* cardlist for questions */}
                  </Collapse>
                </Card>
              )
            }
          })}
          <Row>
            <br/>
          </Row>
        </Container>
      );
    };
  }

export default Deck
