import React from 'react'
import { Container, Row, Col, Input, InputGroup, InputGroupAddon, InputGroupText, Button,
    ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Collapse, Card, CardHeader } from 'reactstrap';

import CardList from './CardList'
import axios from 'axios';

import AddTerm from './AddTerm';
import AddExistingTerm from './AddExistingTerm';

import AddQuestion from './AddQuestion';
import AddPhrase from './AddPhrase'; 


class Deck extends React.Component {
  constructor(props) {
    super(props);
    this.toggleTab = this.toggleTab.bind(this); 

    this.state = {
      searchCard: "", //what gets typed in the search bar that filters the card lists
      collapseNewCard: false, //determines whether or not the new card form is open
      collapseNewPhrase: false,
      collapseNewQuestion: false,
      collapseExistingCard: false,

      addTermButtonOpen: false,

      collapseTab: -1, //determines whether or not a tab is collapsed, maybe should be a number
      tabs: [0,1,2],
      openForm: 0, //determines which input form is open. Is 0 if no form is open

      allTags: [], //contains all the tags in the database. for autocomplete purposes
      

      //state properties below this point are never used, and we should probably delete them
      id: this.props.curModule.moduleID,
      name: this.props.curModule.name,
      language: this.props.curModule.language
    };

  }

  componentDidMount() {
    this.getAllTags();
  }

  //TODO: consider moving this stub of a function into the components that use them
  //function for adding a tag to a list of tags
  addTag = (tagList, tag) => {
    let tempTagList = tagList;

    tempTagList.push(tag);

    return tempTagList;
  }


  //TODO: consider moving this into the components that actually have access to the tags in question
  //fumction for deleting a tag from a list of tags
  deleteTag = (tagList, tag) => {

    if(tagList === undefined){
      return;
    }

    let tempTagList = tagList;

    let tagIndex = tempTagList.indexOf(tag);

    if(tagIndex !== -1){
      tempTagList.splice(tagIndex, 1);
    }

    return tempTagList;
  }


  //function for changing the searchbar for cards
  updateSearchCard(e) {
    this.setState({ searchCard: e.target.value.substr(0,20) });
  }



  toggleTab(e) {
    let event = e.target.dataset.event; 

    console.log("event in toggleTab: ", event)
    console.log("this.state.collapseTab: ", this.state.collapseTab === Number(event) ? -1 : Number(event))
    this.setState({ collapseTab: this.state.collapseTab === Number(event) ? -1 : Number(event) })
  }

  //function that determines if the Add Term button is open
  toggleAddTermButton = () => {
    this.setState({
      addTermButtonOpen: !this.state.addTermButtonOpen
    })
  }


  //gets all the tags in the database
  getAllTags = () => {

    let allTagsInDB = [];

    let header = {
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
      };

    axios.get(this.props.serviceIP + '/tags', header)
      .then(res => {

        allTagsInDB = res.data;

        this.setState({
          allTags: allTagsInDB.tags
        });

      })
      .catch(error => {
        console.log("error in getAllTags(): ", error);
      })
  }

  //function that determines which form is open
  setOpenForm = (openedForm) => {
    if(this.state.openForm === openedForm){
      this.setState({
        openForm: 0
      })
      return;
    }

    this.setState({
      openForm: openedForm
    })
  }


  render () {

      //Variables that store the differnt types of cards in the module
      let terms = this.props.cards
        .filter(card => card.type.toLowerCase() === "match" && card.answers[0] !== undefined)
          .map((card, i) => {return card.answers[0]});


      
      let phrases = this.props.cards
        .filter(card => card.type.toLowerCase() === "phrase")
          .map((card, i) => {return card.answers[0]}); 
      
      let questions = this.props.cards
        .filter(card => card.type.toLowerCase() === "longform")
          .map((card, i) => {return card}); 


      //Gets all answers not in this module
      let termIDArray = terms.map(term => term.termID);

      let allAnswersNotInThisModule = this.props.allAnswers.filter(
                                      answer =>{                                   
                                        if(termIDArray.indexOf(answer.id) === -1){
                                          return true;
                                        } else{
                                          return false;
                                        }
                                      })

      
      console.log("Got into Deck.js render()")
      console.log("cards: ", this.props.cards)
      console.log("terms: ", terms);
      console.log("phrases: ", phrases); 
      console.log("questions: ", questions); 

      ////Variable that stores all of the terms that contain a substring that matches searchCard
      let filteredTerms = terms.filter(
          (term) => { 
            if (term) 
              return ((term.front.toLowerCase().indexOf(this.state.searchCard.toLowerCase()) !== -1) || 
              (term.back.toLowerCase().indexOf(this.state.searchCard.toLowerCase()) !== -1));
            else 
              return null; 
          }
      );


      //Variable that stores all of the phrases that contain a substring that matches searchCard
      let filteredPhrases = phrases.filter(
        (phrase) => { 
          if (phrase) 
            return ((phrase.front.toLowerCase().indexOf(this.state.searchCard.toLowerCase()) !== -1) || 
            (phrase.back.toLowerCase().indexOf(this.state.searchCard.toLowerCase()) !== -1));
          else 
            return null; 
        }
     );

      //Variable that stores all of the questions that contain a substring that matches searchCard
      let filteredQuestions = questions.filter(
        (question) => {
          if(question){
            return(question.questionText.toLowerCase().indexOf(this.state.searchCard.toLowerCase()) !== -1)
          } else
            return null;
        }
      );

      return (
        <Container className='Deck'>
          <Row className='Header' style={{marginBottom: '25px'}}>
            
            {/*Search Bar for all cards in a deck, with the buttons for adding new items as appendages*/}
            <InputGroup style={{borderRadius: '12px'}}>          
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  {this.props.curModule.name}
                </InputGroupText>
              </InputGroupAddon>
              
              <Input 
                type="text" 
                placeholder="Search" 
                value={this.state.searchCard} 
                onChange={this.updateSearchCard.bind(this)}
              />
              
              {/*The button for the Add Term forms*/}
              <InputGroupAddon addonType="append">
                <ButtonDropdown 
                  style={{backgroundColor:'#3e6184'}} 
                  isOpen={this.state.addTermButtonOpen}
                  toggle={this.toggleAddTermButton}
                  >
                  <DropdownToggle caret>
                    Add Term
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => this.setOpenForm(1)}> Add Existing</DropdownItem>
                    <DropdownItem onClick={() => this.setOpenForm(2)}> Add New</DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </InputGroupAddon>

              {/*The button for the Add Phrase form*/}
              <InputGroupAddon addonType="append">
                <Button style={{backgroundColor:'#3e6184'}} onClick={() => this.setOpenForm(3)}>
                  Add Phrase
                </Button>
              </InputGroupAddon>

              {/*The button for the Add Question form*/}
              <InputGroupAddon addonType="append">
                <Button style={{backgroundColor:'#3e6184'}} onClick={() => this.setOpenForm(4)}>
                  Add Question
                </Button>
              </InputGroupAddon>
            </InputGroup>

            <Col>

              {/*Form for adding a new Term*/}
              <Collapse isOpen={this.state.openForm === 2}>     
                <AddTerm
                  curModule={this.props.curModule} 
                  updateCurrentModule={this.props.updateCurrentModule}
                  serviceIP={this.props.serviceIP}
                  deleteTag={this.deleteTag}
                  addTag={this.addTag}
                  allTags={this.state.allTags}
                  setOpenForm={this.setOpenForm}
                  />        
              </Collapse>

              {/*Form for adding an existing Term*/}
              <Collapse isOpen={this.state.openForm === 1}>     
                <AddExistingTerm
                  curModule={this.props.curModule} 
                  updateCurrentModule={this.props.updateCurrentModule}
                  serviceIP={this.props.serviceIP}
                  deleteTag={this.deleteTag}
                  addTag={this.addTag}
                  allTags={this.state.allTags}
                  allAnswers={allAnswersNotInThisModule}
                  setOpenForm={this.setOpenForm}
                  />        
              </Collapse>

            {/*Form for adding a new Phrase*/}
              <Collapse isOpen={this.state.openForm === 3}>
                <AddPhrase
                  curModule={this.props.curModule} 
                  updateCurrentModule={this.props.updateCurrentModule}
                  serviceIP={this.props.serviceIP}
                  setOpenForm={this.setOpenForm}
                />
              </Collapse>

            {/*Form for adding a new Question*/}
              <Collapse isOpen={this.state.openForm === 4}>
                <AddQuestion
                  curModule={this.props.curModule} 
                  updateCurrentModule={this.props.updateCurrentModule}
                  serviceIP={this.props.serviceIP}
                        
                  allAnswers={this.props.allAnswers}
                  allAnswersNotInThisModule={allAnswersNotInThisModule}
                  
                  deleteTag={this.deleteTag}
                  addTag={this.addTag}
                  allTags={this.state.allTags}
                  setOpenForm={this.setOpenForm}
                  />
              </Collapse>
            </Col>
          </Row>

          {this.state.tabs.map((index,i) => { 
            if (index === 0) {
              //Terms Accordion
              return (
                <Card  key={i} style={{ marginBottom: '1rem' }}>
                  <CardHeader onClick={this.toggleTab} data-event={index}>
                    Terms
                  </CardHeader>

                  <Collapse isOpen={this.state.collapseTab === index}>
                    <CardList 
                      type={0} 
                      cards = {filteredTerms} 
                      serviceIP={this.props.serviceIP} 
                      curModule={this.props.curModule} 
                      updateCurrentModule={this.props.updateCurrentModule}
                      deleteTag={this.deleteTag} 
                      addTag={this.addTag} 
                      allTags={this.state.allTags}/>
                  </Collapse>
                </Card>
              )
            }
            else if (index === 1) {
              //Phrases Accordion
              return (                
                <Card key={i} style={{ marginBottom: '1rem' }}>
                  <CardHeader onClick={this.toggleTab} data-event={index}>
                    Phrases
                  </CardHeader>

                  <Collapse isOpen={this.state.collapseTab === index}>
                    <CardList 
                      type={1} 
                      cards={filteredPhrases} 
                      serviceIP={this.props.serviceIP}
                      curModule={this.props.curModule} 
                      updateCurrentModule={this.props.updateCurrentModule}/>
                  </Collapse>
                </Card>
              )
            }
            else {
              //Questions Accordion
              return (
                <Card key={i} style={{ marginBottom: '1rem' }}>
                  <CardHeader onClick={this.toggleTab} data-event={index}>
                    Questions
                  </CardHeader>
                  
                  <Collapse isOpen={this.state.collapseTab === index}>
                    <CardList 
                        type={2} 
                        cards={filteredQuestions} 
                        serviceIP={this.props.serviceIP}
                        curModule={this.props.curModule} 
                        updateCurrentModule={this.props.updateCurrentModule}
                    />
                  </Collapse>
                </Card>
              )
            }
          })
          }

          <Row>
            <br/>
          </Row>
        </Container>
      );
    };
  }

export default Deck
