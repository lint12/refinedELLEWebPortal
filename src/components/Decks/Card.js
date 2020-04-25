import React from 'react'
import { Button, ButtonGroup } from 'reactstrap';


class Card extends React.Component {
  constructor(props){
    super(props);
    this.deleteCard = this.deleteCard.bind(this);
    this.downloadImg = this.downloadImg.bind(this);
    this.downloadAudio = this.downloadAudio.bind(this);

    this.state = {
      card: this.props.card
    }

  }

  deleteCard = (id) => {
    console.log(id)
  }

  editCard(id) {
    console.log('clicked on edit btn')
  }

  downloadImg(id){
    //console.log(this.state.cards.imageLocation);
  }

  downloadAudio(id){
    //console.log(this.state.cards.audioLocation);
  }

  render() {
    return (
      <tr>
  			<td>{this.state.card.front}</td>
  			<td>{this.state.card.back}</td>
        <td><Button style={{backgroundColor: 'white', width: '100%'}} onClick={this.downloadImg(this.state.card.cardID)}><img src={"./../../../image.png"} alt="image icon" style={{width: '25px', height: '25px'}}/></Button></td>
        <td><Button style={{backgroundColor: 'white', width: '100%'}} onClick={this.downloadAudio(this.state.card.cardID)}><img src={"./../../../headphones.png"} alt="headphones icon" style={{width: '25px', height: '25px'}}/></Button></td>
        <td>{this.state.card.cardID}</td>
        <td>
          <ButtonGroup>
          <Button style={{backgroundColor: 'lightcyan'}} onClick={this.editCard(this.state.card.cardID)}><img src={"./../../../tools.png"} alt="edit icon" style={{width: '25px', height: '25px'}}/></Button>
          <Button style={{backgroundColor: 'lightcoral'}} onClick={this.deleteCard(this.state.card.cardID)}><img src={"./../../../delete.png"} alt="trash can icon" style={{width: '25px', height: '25px'}}/></Button>
          </ButtonGroup>
        </td>
      </tr>
    );
  }
}

export default Card
