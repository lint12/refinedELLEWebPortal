import React, {Fragment} from 'react'
import { Button, ButtonGroup, Form, FormGroup, Input, Collapse} from 'reactstrap';

import TagList from './TagList';

class Card extends React.Component {
  constructor(props){
    super(props);
    this.deleteCard = this.deleteCard.bind(this);
    this.downloadImg = this.downloadImg.bind(this);
    this.downloadAudio = this.downloadAudio.bind(this);
    
    this.submitEdit = this.submitEdit.bind(this);
    
    this.editFront = this.editFront.bind(this);
    this.editBack = this.editBack.bind(this);

    this.state = {
      card: this.props.card,
      tags: ["noun", "food", "yellow", "fruit"],

      collapseTags: false,

      editMode: false,
      editedFront: this.props.card.front,
      editedBack: this.props.card.back,
      uploadedImage: null,
      uploadedAudio: null,
    }

  }

  deleteCard = (id) => {
    console.log("clicked on delete button, id: ", id);
  }

  toggleCollapsedTags = () => {
    this.setState({collapseTags: !this.state.collapseTags});
  }

  editCard(id) {
    this.setState({editMode: true})
    console.log('clicked on edit btn');
  }

  editFront = (event) => {
    this.setState({editedFront: event.target.value});
  }

  editBack = (event) => {
    this.setState({editedBack: event.target.value});
  }

  uploadImage = (imgFile) => {
    this.setState({uploadedImage: imgFile});
  }

  uploadAudio = (audioFile) => {
    this.setState({uploadedAudio: audioFile});
  }


  submitEdit = (event) => {
    this.setState({editMode: false})
    console.log("clicked on submit edit");
    console.log("editedFront: ", this.state.editedFront, "editedBack: ", this.state.editedBack);
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
      console.log("rendering normal Card!");
      return (
        <Fragment>
        <tr onClick={this.toggleCollapsedTags}>
    			<td>{front}</td>
    			<td>{back}</td>
          <td><Button style={{backgroundColor: 'white', width: '100%'}} onClick={this.downloadImg(termID)}><img src={"./../../../image.png"} alt="image icon" style={{width: '25px', height: '25px'}}/></Button></td>
          <td><Button style={{backgroundColor: 'white', width: '100%'}} onClick={this.downloadAudio(termID)}><img src={"./../../../headphones.png"} alt="headphones icon" style={{width: '25px', height: '25px'}}/></Button></td>
          <td>{termID}</td>
          <td>
            <ButtonGroup>
            <Button style={{backgroundColor: 'lightcyan'}} onClick={() => this.editCard(termID)}><img src={"./../../../tools.png"} alt="edit icon" style={{width: '25px', height: '25px'}}/></Button>
            <Button style={{backgroundColor: 'lightcoral'}} onClick={() => this.deleteCard(termID)}><img src={"./../../../delete.png"} alt="trash can icon" style={{width: '25px', height: '25px'}}/></Button>
            </ButtonGroup>
          </td>
        </tr>
        <Collapse isOpen={this.state.collapseTags}>
          <tr>
              
              <td colspan="3" style={{border:"none"}}><TagList style={{border:"none"}} tags={this.state.tags} /></td>
            

            
          
          </tr>
        </Collapse>
        </Fragment>

      );
    } else{
      console.log("rendering editable card!");
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
