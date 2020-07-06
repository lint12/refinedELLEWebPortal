import React from 'react'
import { Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios';

class Card extends React.Component {
  constructor(props){
    super(props);
    this.handleEdit = this.handleEdit.bind(this); 
    this.editCard = this.editCard.bind(this);
    this.handleDelete = this.handleDelete.bind(this); 
    this.deleteCard = this.deleteCard.bind(this);
    this.downloadImg = this.downloadImg.bind(this);
    this.downloadAudio = this.downloadAudio.bind(this);

    this.state = {
      card: this.props.card,
      modal: false
    }

  }

  handleEdit = () => {
    console.log("clicked on edit btn"); 
  }

  editCard = () => {

  }

  handleDelete = () => {
    console.log(this.state.card); 
    this.toggleModal(); 
  }

  deleteCard = e => {
    console.log("call API request to delete"); 
    e.preventDefault();

    axios.delete('http://34.239.123.94:3000/term', 
    { data: { termID: this.state.card.termID }, headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }})
  }

  toggleModal = () => {
    this.setState({ modal: !this.state.modal })
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
        <td><Button style={{backgroundColor: 'white', width: '100%'}} onClick={this.downloadImg.bind(this.state.card.cardID)}><img src={"./../../../image.png"} alt="frame icon" style={{width: '25px', height: '25px'}}/></Button></td>
        <td><Button style={{backgroundColor: 'white', width: '100%'}} onClick={this.downloadAudio.bind(this.state.card.cardID)}><img src={"./../../../headphones.png"} alt="headphones icon" style={{width: '25px', height: '25px'}}/></Button></td>
        <td>{this.state.card.termID}</td>
        <td>
          <ButtonGroup>
          <Button style={{backgroundColor: 'lightcyan'}} onClick={this.handleEdit.bind()}><img src={"./../../../tools.png"} alt="edit icon" style={{width: '25px', height: '25px'}}/></Button>
          <Button style={{backgroundColor: 'lightcoral'}} onClick={this.handleDelete.bind()}><img src={"./../../../delete.png"} alt="trash can icon" style={{width: '25px', height: '25px'}}/></Button>
          </ButtonGroup>
          <Modal isOpen={this.state.modal} toggle={this.toggleModal}> 
            <ModalHeader toggle={this.toggleModal}>Delete</ModalHeader>
            <ModalBody>
              <p>Are you sure you want to delete the card: {this.state.card.cardName}?</p>
            </ModalBody>
            <ModalFooter>
              <Button onClick={this.toggleModal}>Cancel</Button>
              <Button color="danger" onClick={this.deleteCard.bind()}>Delete</Button>
            </ModalFooter>
          </Modal>
        </td>
      </tr>
    );
  }
}

export default Card
