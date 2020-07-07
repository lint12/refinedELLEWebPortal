import React, {Fragment} from 'react'
import { Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter, Collapse, Input} from 'reactstrap';
import axios from 'axios';

import TagList from './TagList';

class Card extends React.Component {
  constructor(props){
    super(props);
    this.handleEdit = this.handleEdit.bind(this); 
    this.editCard = this.editCard.bind(this);
    this.handleDelete = this.handleDelete.bind(this); 
    this.deleteCard = this.deleteCard.bind(this);
    this.downloadImg = this.downloadImg.bind(this);
    this.downloadAudio = this.downloadAudio.bind(this);
    this.toggleCollapsedTags = this.toggleCollapsedTags.bind(this);

    this.editFront = this.editFront.bind(this);
    this.editBack = this.editBack.bind(this);
    this.submitEdit = this.submitEdit.bind(this);

    this.state = {
      card: this.props.card,
      modal: false,

      editMode: false,
      editedFront: this.props.card.front,
      editedBack: this.props.card.back,
      collapseTags: false,

      tags: ["tag1", "tag2", "tag3"]
    }

  }

  handleEdit = () => {
    console.log("clicked on edit btn"); 
  }

  editCard = () => {
    this.setState({editMode: true})
  }

  editFront = (event) => {
    this.setState({editedFront: event.target.value});
  }

  editBack = (event) => {
    this.setState({editedBack: event.target.value});
  }

  submitEdit = (event) => {
    this.setState({editMode: false});
    console.log("clicked on submit edit")

    //TODO: actually create a new card
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

  toggleCollapsedTags = () => {
    this.setState({collapseTags: !this.state.collapseTags})
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
    let {front, back, termID} = this.state.card;

    if(this.state.editMode == false){
    return (

      <Fragment>
      <tr onClick={this.toggleCollapsedTags}>
  			<td>{front}</td>
  			<td>{back}</td>
        <td><Button style={{backgroundColor: 'white', width: '100%'}} onClick={this.downloadImg.bind(this.state.card.cardID)}><img src={"./../../../image.png"} alt="frame icon" style={{width: '25px', height: '25px'}}/></Button></td>
        <td><Button style={{backgroundColor: 'white', width: '100%'}} onClick={this.downloadAudio.bind(this.state.card.cardID)}><img src={"./../../../headphones.png"} alt="headphones icon" style={{width: '25px', height: '25px'}}/></Button></td>
        <td>{termID}</td>
        <td>
          <ButtonGroup>
          <Button style={{backgroundColor: 'lightcyan'}} onClick={() => this.editCard()}><img src={"./../../../tools.png"} alt="edit icon" style={{width: '25px', height: '25px'}}/></Button>
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

        <Collapse isOpen={this.state.collapseTags}>
            <tr>
              <td style={{border:"none"}}><TagList tags={this.state.tags} /></td>
            </tr>
        </Collapse>

      </Fragment>
      );
      } else{
        return (
        <tr>
          <td><Input type="value" onChange={this.editFront} value={this.state.editedFront} /></td>
          <td><Input type="value" onChange={this.editBack} value={this.state.editedBack} /></td>
          <td><Button style={{backgroundColor: 'white', width: '100%'}} onClick={this.downloadImg(termID)}><img src={"./../../../image.png"} alt="image icon" style={{width: '25px', height: '25px'}}/></Button></td>
          <td><Button style={{backgroundColor: 'white', width: '100%'}} onClick={this.downloadAudio(termID)}><img src={"./../../../headphones.png"} alt="headphones icon" style={{width: '25px', height: '25px'}}/></Button></td>
          <td>{termID}</td>
          <td>
            <ButtonGroup>
              <Button style={{backgroundColor: 'lightcyan', width: '100%', height: '100%', color: 'black'}} onClick = {this.submitEdit}> Submit </Button>
            </ButtonGroup>
          </td>
        </tr>
        );
      }
    
  }
}

export default Card
