import React, {Fragment} from 'react'
import { Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter, Collapse, Input } from 'reactstrap';
import axios from 'axios';

import TagList from './TagList';

class Card extends React.Component {
  constructor(props){
    super(props);
    this.handleEdit = this.handleEdit.bind(this); 
    this.editCard = this.editCard.bind(this);
    this.handleDelete = this.handleDelete.bind(this); 
    this.deleteCard = this.deleteCard.bind(this);
    this.toggleCollapsedTags = this.toggleCollapsedTags.bind(this);

    this.editFront = this.editFront.bind(this);
    this.editBack = this.editBack.bind(this);
    this.editType = this.editType.bind(this); 
    this.editGender = this.editGender.bind(this); 
    this.submitEdit = this.submitEdit.bind(this);

    this.state = {
      card: this.props.card,
      modal: false,

      editMode: false,
      editedFront: this.props.card.front,
      editedBack: this.props.card.back,
      editedType: this.props.card.type, 
      editedGender: this.props.card.gender, 
      collapseTags: false,
      
      selectedImgFile: this.props.card.imageLocation, 
      selectedAudioFile: this.props.card.audioLocation, 
      changedImage: false, 
      changedAudio: false, 

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

  editType = (event) => {
    this.setState({editedType: event.target.value}); 
  }

  editGender = (event) => {
    this.setState({editedGender: event.target.value}); 
  }

  imgFileSelectedHandler = (event) => {
    console.log("CLICKED ON IMG SELECTER")
    this.setState({ 
      selectedImgFile: event.target.files[0], 
      changedImage: true //remember to change it back to false later 
    }); 
  }

  audioFileSelectedHandler = (event) => {
    console.log("CLICKED ON AUDIO SELECTER")
    this.setState({
      selectedAudioFile: event.target.files[0], 
      changedAudio: true //remember to change it back to false later 
    })
  }

  submitEdit = (event) => {
    this.setState({editMode: false});
    console.log("clicked on submit edit")
    console.log("file selected: ", this.state.selectedPicFile); 

    const data = new FormData(); 

    data.append('image', this.state.changedImage ? this.state.selectedImgFile : null); 
    data.append('audio', this.state.changedAudio ? this.state.selectedAudioFile : null); 
    data.append('front', this.state.editedFront); 
    data.append('back', this.state.editedBack); 
    data.append('language', this.props.card.language); //not editable 

    //map through all the tags and make a tag field object for them 
    this.state.tags.map((label) => {
      return ( data.append('tag', label) )
    })

    data.append('type', this.state.editedType); //editable
    data.append('gender', this.state.editedGender); //editable  
    data.append('termID', this.props.card.termID); //not editable
    
    axios.post(this.props.serviceIP + '/term', data, 
      {headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }).then(res => {
      console.log(res.data);
      this.setState({
        changedImage: false, 
        changedAudio: false
      })

      this.props.updateCurrentModule({ module: this.props.curModule });  
    }).catch(function (error) {
      console.log(error);
    });
  }

  //toggling delete modal, is not related to delete card API 
  handleDelete = () => {
    console.log(this.state.card); 
    this.toggleModal(); 
  }

  deleteCard = (e) => {
    console.log("call API request to delete"); 
    console.log(this.state.card.termID);
    this.toggleModal(); 
    axios.delete(this.props.serviceIP + '/term', { data: { termID: this.state.card.termID },
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }).then( res => {
      console.log(res.data);
      this.props.updateCurrentModule({ module: this.props.curModule });  
    }).catch(function (error) {
      console.log(error);
    });
  }

  toggleCollapsedTags = () => {
    this.setState({collapseTags: !this.state.collapseTags})
  }

  toggleModal = () => {
    this.setState({ modal: !this.state.modal })
  }

  render() {
    let {editedFront, editedBack, editedType, editedGender, selectedImgFile, selectedAudioFile} = this.state;
    let imgLink = "http://34.239.123.94/Images/" + selectedImgFile;
    let audioLink = "http://34.239.123.94/Audios/" + selectedAudioFile;

    console.log("LINK: ", imgLink + selectedImgFile); 
    if (this.state.editMode === false){
      return (
        <Fragment>
        <tr onClick={this.toggleCollapsedTags}>
          <td>{editedFront}</td>
          <td>{editedBack}</td>
          <td>{editedType}</td>
          <td>{editedGender}</td>
          <td>
            {/* favicon is just a placeholder for now more testing needs to be done after deployment */}
            <Button style={{backgroundColor: 'white', width: '100%'}} href="http://localhost:3000/favicon.ico" download>
            <img src={"./../../../image.png"} alt="frame icon" style={{width: '25px', height: '25px'}}/>
            </Button>
          </td>
          <td>
            {/* audio has to be in the same domain */}
            <Button style={{backgroundColor: 'white', width: '100%'}} href={audioLink} download> 
            <img src={"./../../../headphones.png"} alt="headphones icon" style={{width: '25px', height: '25px'}}/>
            </Button>
          </td>
          <td>{this.state.card.termID}</td>
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
                <td style={{border:"none"}}><TagList tags={this.state.tags}/></td>
              </tr>
          </Collapse>
        </Fragment>
      );
    } 
    else{
      return (
      <tr>
        <td><Input type="value" onChange={this.editFront} value={this.state.editedFront} /></td>
        <td><Input type="value" onChange={this.editBack} value={this.state.editedBack} /></td>
        <td><Input type="value" onChange={this.editType} value={this.state.editedType} /></td>
        <td><Input type="value" onChange={this.editGender} value={this.state.editedGender} /></td>
        <input style={{display: 'none'}} type="file" onChange={this.imgFileSelectedHandler}
          ref={imgInput => this.imgInput = imgInput}/>
        <td>
          <Button style={{backgroundColor: 'lightseagreen', width: '100%', fontSize: 'small'}} onClick={() => this.imgInput.click()}>
            Upload <br /> Image
          </Button>
        </td>
        <input style={{display: 'none'}} type="file" onChange={this.audioFileSelectedHandler}
          ref={audioInput => this.audioInput = audioInput}/>
        <td>
          <Button style={{backgroundColor: 'lightseagreen', width: '100%', fontSize: 'small'}} onClick={() => this.audioInput.click()}>
            Upload <br /> Audio
          </Button>
        </td>
        <td>{this.state.card.termID}</td>
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
