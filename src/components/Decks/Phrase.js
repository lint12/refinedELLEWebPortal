import React from 'react'
import { Button, ButtonGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
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
            changedAudio: false 
		};
    }

    editPhrase = () => {
        console.log("edit btn for phrase is pressed")
        this.setState({ editMode: true }); 
    }

    submitEdit = (event) => {
        console.log("need to call api to edit phrase"); 
    }

    handleCancelEdit = (event) => {
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
        console.log(this.state.card); 
        this.toggleModal(); 
    }

    deletePhrase = () => {
        console.log("call api to delete phrase")
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
                    <td>{id}</td>
                    <td>
                    <ButtonGroup>
                        <Button style={{backgroundColor: 'lightcyan', width: '50%', height: '100%', color: 'black'}} onClick = {this.submitEdit}> Submit </Button>
                        <Button style={{backgroundColor: 'lightcyan', width: '50%', height: '100%', color: 'black'}} onClick = {this.handleCancelEdit}> Cancel </Button>
                    </ButtonGroup>
                    </td>
                </tr>
            }
            </>
        )
    }
}

export default Phrase