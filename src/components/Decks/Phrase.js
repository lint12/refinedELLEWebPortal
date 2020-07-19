import React from 'react'
import { Button, ButtonGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter, Tooltip } from 'reactstrap';
import '../../stylesheets/style.css';
import axios from 'axios';

class Phrase extends React.Component {
    constructor(props) {
        super(props);

        this.change = this.change.bind(this);
        this.editPhrase = this.editPhrase.bind(this); 
        this.submitEdit = this.submitEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this); 
        this.deletePhrase = this.deletePhrase.bind(this);

        this.toggleImgTooltipOpen = this.toggleImgTooltipOpen.bind(this); 
        this.toggleAudioTooltipOpen = this.toggleAudioTooltipOpen.bind(this); 

        this.state = {
            card: this.props.card, 
            editedFront: this.props.card.front,
            editedBack: this.props.card.back, 
            selectedImgFile: this.props.card.imageLocation, 
            selectedAudioFile: this.props.card.audioLocation, 
            id: this.props.card.termID,

            modal: false, 
            editMode: false, 
            changedImage: false, 
            changedAudio: false,
            imgTooltipOpen: false, 
            audioTooltipOpen: false, 
		};
    }

    editPhrase = () => {
        console.log("edit btn for phrase is pressed")
        this.setState({ editMode: true }); 
    }

    submitEdit = (event) => {
        console.log("need to call api to edit phrase"); 
        this.setState({editMode: false});

        const data = new FormData(); 

        let header = {
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
        };

        //TYPEOF this 'term' will always be ph, so we will not allow the user to edit or see the type 

        data.append('image', this.state.changedImage && this.state.selectedImgFile !== undefined ? this.state.selectedImgFile : null); 
        data.append('audio', this.state.changedAudio && this.state.selectedAudioFile !== undefined ? this.state.selectedAudioFile : null); 

        data.append('front', this.state.editedFront); 
        data.append('back', this.state.editedBack); 
        data.append('language', this.props.card.language); //not editable 
        data.append('termID', this.props.card.termID); //not editable

        axios.post(this.props.serviceIP + '/term', data, header)
        .then(res => {
          this.setState({
            changedImage: false, 
            changedAudio: false
          });
          
          console.log(res.data);
          this.props.updateCurrentModule({ module: this.props.curModule });  
        }).catch(error => {
          console.log("submitEdit in Phrase.js error: ", error); 
        });
    }

    handleCancelEdit = () => {
        this.setState({
          card: this.props.card,
          editedFront: this.props.card.front,
          editedBack: this.props.card.back,
          selectedImgFile: this.props.card.imageLocation, 
          selectedAudioFile: this.props.card.audioLocation, 
          id: this.props.card.termID,

          modal: false,
          editMode: false,
          changedImage: false, 
          changedAudio: false, 
        });
    }
      
    handleDelete = () => {
        console.log("delete btn for phrase is pressed", this.state.card); 
        this.toggleModal(); 
    }

    deletePhrase = () => {
        console.log("call api to delete phrase");

        this.toggleModal(); 

        let header = { 
          data: { termID: this.state.card.termID },
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
        };
    
        axios.delete(this.props.serviceIP + '/term', header)
          .then( res => {
            console.log(res.data);
            this.props.updateCurrentModule({ module: this.props.curModule });  
          })
          .catch(error => {
            console.log("deleteCard in Phrase.js error: ", error);
          });
    }

    change(e) {
	    this.setState({
	      [e.target.name]: e.target.value
		})
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

    toggleImgTooltipOpen = () => {
        this.setState({ imgTooltipOpen: !this.state.imgTooltipOpen }); 
    }
    
    toggleAudioTooltipOpen = () => {
        this.setState({ audioTooltipOpen: !this.state.audioTooltipOpen }); 
    }

    toggleModal = () => {
        this.setState({ modal: !this.state.modal })
    }

    render () {
        let {editedFront, editedBack, selectedImgFile, selectedAudioFile, id, editMode} = this.state;

        let imgLink = "http://34.239.123.94/Images/" + selectedImgFile;
        let audioLink = "http://34.239.123.94/Audios/" + selectedAudioFile;

        return (
            <>
            {editMode === false ? 
                <tr>
                    <td>{editedFront}</td>
                    <td>{editedBack}</td>
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
                    <td>{id}</td>
                    <td>
                        <ButtonGroup>
                        <Button style={{backgroundColor: 'lightcyan'}} onClick={() => this.editPhrase()}><img src={"./../../../tools.png"} alt="edit icon" style={{width: '25px', height: '25px'}}/></Button>
                        <Button style={{backgroundColor: 'lightcoral'}} onClick={this.handleDelete.bind()}><img src={"./../../../delete.png"} alt="trash can icon" style={{width: '25px', height: '25px'}}/></Button>
                        </ButtonGroup>
                        <Modal isOpen={this.state.modal} toggle={this.toggleModal}> 
                        <ModalHeader toggle={this.toggleModal}>Delete</ModalHeader>
                        <ModalBody>
                            <p>Are you sure you want to delete the phrase: {editedFront}?</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={this.toggleModal}>Cancel</Button>
                            <Button color="danger" onClick={this.deletePhrase.bind()}>Delete</Button>
                        </ModalFooter>
                        </Modal>
                    </td>
                </tr>
            : //else
                <tr>
                    <td><Input type="value" name="editedFront" onChange={e => this.change(e)} value={this.state.editedFront} /></td>
                    <td><Input type="value" name="editedBack" onChange={e => this.change(e)} value={this.state.editedBack} /></td>
                    <td>
                        <input style={{display: 'none'}} type="file" onChange={this.imgFileSelectedHandler}
                            ref={imgInput => this.imgInput = imgInput}/>
                        <Button style={{backgroundColor: 'lightseagreen', width: '100%', fontSize: 'small'}} 
                            id="uploadImage" onClick={() => this.imgInput.click()}>
                            <img 
                                src={"./../../../uploadImage.png"} 
                                alt="Icon made by Pixel perfect from www.flaticon.com" 
                                style={{width: '25px', height: '25px'}}
                            />
                        </Button>
                        <Tooltip placement="top" isOpen={this.state.imgTooltipOpen} target="uploadImage" toggle={this.toggleImgTooltipOpen}>
                            Upload Image
                        </Tooltip>
                    </td>
                    <td>
                        <input style={{display: 'none'}} type="file" onChange={this.audioFileSelectedHandler}
                            ref={audioInput => this.audioInput = audioInput}/>
                        <Button style={{backgroundColor: 'lightseagreen', width: '100%', fontSize: 'small'}} 
                            id="uploadAudio" onClick={() => this.audioInput.click()}>
                            <img 
                                src={"./../../../uploadAudio.png"} 
                                alt="Icon made by Pixel perfect from www.flaticon.com" 
                                style={{width: '25px', height: '25px'}}
                            />
                        </Button>
                        <Tooltip placement="top" isOpen={this.state.audioTooltipOpen} target="uploadAudio" toggle={this.toggleAudioTooltipOpen}>
                            Upload Audio
                        </Tooltip>
                    </td>
                    <td>{id}</td>
                    <td>
                    <ButtonGroup>
                        <Button style={{backgroundColor: 'lightcyan', width: '50%', height: '100%', color: 'black'}} onClick = {this.submitEdit}>
                        <img 
                            src={"./../../../submit.png"} 
                            alt="Icon made by Becris from www.flaticon.com" 
                            style={{width: '25px', height: '25px'}}
                        />
                        </Button>
                        <Button style={{backgroundColor: 'lightcyan', width: '50%', height: '100%', color: 'black'}} onClick = {this.handleCancelEdit}>
                        <img 
                            src={"./../../../cancel.png"} 
                            alt="Icon made by Freepik from www.flaticon.com" 
                            style={{width: '25px', height: '25px'}}
                        />
                        </Button>
                    </ButtonGroup>
                    </td>
                </tr>
            }
            </>
        )
    }
}

export default Phrase