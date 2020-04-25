import React from 'react'
import { Container, Row, Col, Media } from 'reactstrap';
import CardList from './CardList'
import axios from 'axios';

class Deck extends React.Component {
  constructor(props) {
    super(props);
    this.change = this.change.bind(this);
    this.submit = this.submit.bind(this);
    this.state = {
      cardID: '',
      id: this.props.id,
      deck: this.props.deck,

      deckName: '',
      ttype: "",

      cards: [],//{front: "Select a", back: "deck!", cardID: "1"}],
    };

  }

  updateDeck(e) {
    console.log("tttt");
    axios.get(this.props.serviceIP + '/deck/' + e.deck.id, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
    }).then( res => {
      console.log(res.data);
      let cards = res.data;
      this.setState({
        id: e.deck.id,
        deck:e.deck,
        cards: cards
      });
    }).catch(function (error) {
      console.log(error);
    });
    console.log(this.state.deck);
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
        console.log(this.state.deck);*/
  }

  render () {
      return (
        <Container className='Deck'>
          <Row className='Header'>
            <Col>
              <Media body>
                <Media heading>
                </Media>
              </Media>
            </Col>
          </Row>
            <CardList
            cards = {this.state.cards}
            />
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
      );
    };
  }

export default Deck
