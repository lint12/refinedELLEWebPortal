import React from 'react'
import { Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import '../../stylesheets/style.css';
import axios from 'axios';

class Phrase extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            card: this.props.card, 
            editedFront: this.props.card.front,
            editedBack: this.props.card.back, 
            selectedImgFile: this.props.card.imageLocation, 
            selectedAudioFile: this.props.card.audioLocation, 
            id: this.props.card.termID,

            modal: false
		};
    }

    editPhrase = () => {
        console.log("edit btn for phrase is pressed")
        // this.setState({editMode: true,
        //               collapseTags: true})
    }

    handleDelete = () => {
        console.log(this.state.card); 
        this.toggleModal(); 
    }

    deletePhrase = () => {
        console.log("call api to delete phrase")
    }

    toggleModal = () => {
        this.setState({ modal: !this.state.modal })
    }

    render () {
        let {editedFront, editedBack, selectedImgFile, selectedAudioFile, id} = this.state;

        let imgLink = "http://34.239.123.94/Images/" + selectedImgFile;
        let audioLink = "http://34.239.123.94/Audios/" + selectedAudioFile;

        return (
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
        )
    }
}

export default Phrase