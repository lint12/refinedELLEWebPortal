import React, {Fragment} from 'react'
import { Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter, Collapse, Input, CustomInput, Tooltip } from 'reactstrap';
import axios from 'axios';

import AnswerButtonList from './AnswerButtonList';
import Autocomplete from './Autocomplete';

class Question extends React.Component {
  constructor(props){
    super(props);
    this.editQuestion = this.editQuestion.bind(this);
    this.handleDelete = this.handleDelete.bind(this); 
    this.deleteQuestion = this.deleteQuestion.bind(this);
    this.toggleCollapsedAnswers = this.toggleCollapsedAnswers.bind(this);

    this.toggleImgTooltipOpen = this.toggleImgTooltipOpen.bind(this); 
    this.toggleAudioTooltipOpen = this.toggleAudioTooltipOpen.bind(this); 

    this.submitEdit = this.submitEdit.bind(this);
    this.change = this.change.bind(this);

    console.log("This Question: ", this.props.question)

    this.state = {
      question: this.props.question, //contains all of the data in the question
      modal: false,
      imgTooltipOpen: false, 
      audioTooltipOpen: false, 

      editMode: false, //determines whether or not the editable version of the question is showing
      editedFront: this.props.question.front, //contains the English word that can be edited
      collapseAnswers: false, //determines whether or not the answers are displayed on the question
      
      selectedImgFile: this.props.question.imageLocation, //contains the location of the image for the question
      selectedAudioFile: this.props.question.audioLocation, //contains the location of the audio for the question
      changedImage: false, //determines whether or not the image file was changed
      changedAudio: false, //determines whether or not the audio file was changed

      //TODO: populate answers with API call instead of dummy data
      answers: ["answer1", "answer2", "answer3"] //contains the list of answers
    }

  }
  //TODO: handleAddAnswer and createAnswer kinda do the same thing. Maybe they should be one thing?
  //function that adds a answer to list of answers on this question(only available when editmode is true)
  handleAddAnswer = (event) => {
    let list = this.props.addAnswer(this.state.answers, event.answer);

    this.setState({
      answers: list
    })
  }


  //function that adds a new answer from user input to list of answers on this question(only when editmode is true)
  createAnswer = (answer) => {

    let tempAnswers = this.state.answers;
    tempAnswers.push(answer);
    this.setState({
      answers: tempAnswers
    });
  }

  //function that gets called when the edit button is pushed. Sets editmode to true
  editQuestion = () => {
    this.setState({editMode: true,
                  collapseAnswers: true})
  }

  //function that changes the state of front, back, type, and gender based off of the name given to the input objects
  change(e) {
    this.setState({
        [e.target.name]: e.target.value
    })
  }

  //function that inputs image when user uploads a new image to the question
  imgFileSelectedHandler = (event) => {
    this.setState({ 
      selectedImgFile: event.target.files[0], 
      changedImage: true //remember to change it back to false later 
    }); 
  }

  //function that inputs audio when user uploads new audio to the question
  audioFileSelectedHandler = (event) => {
    this.setState({
      selectedAudioFile: event.target.files[0], 
      changedAudio: true //remember to change it back to false later 
    })
  }

  //function that submits all of the edited data put on a question 
  submitEdit = (event) => {
    console.log("Changed image?: ", this.state.changedImage); 
    console.log("selectedImg: ", this.state.selectedImgFile);

    console.log("FRONT: ", this.state.editedFront); 
    console.log("BACK: ", this.state.editedBack); 
    console.log("TYPE: ", this.state.editedType); 
    console.log("GENDER: ", this.state.editedGender); 

    this.setState({editMode: false});

    const data = new FormData(); 
    let header = {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    };

    data.append('image', this.state.changedImage && this.state.selectedImgFile !== undefined ? this.state.selectedImgFile : null); 
    data.append('audio', this.state.changedAudio && this.state.selectedAudioFile !== undefined ? this.state.selectedAudioFile : null); 
    data.append('front', this.state.editedFront); 
    data.append('back', this.state.editedBack); 
    data.append('language', this.props.question.language); //not editable 

    //map through all the answers and make a answer field object for them 
    this.state.answers.map((label) => {
      return ( data.append('answer', label) )
    })

    data.append('termID', this.props.question.termID); //not editable
    
    axios.post(this.props.serviceIP + '/term', data, header)
      .then(res => {
        this.setState({
          changedImage: false, 
          changedAudio: false
        });

        this.props.updateCurrentModule({ module: this.props.curModule });  
      })
      .catch(error => {
        console.log("submitEdit in question.js error: ", error);
      });
  }

  //toggling delete modal, is not related to delete question API 
  handleDelete = () => {
    console.log(this.state.question); 
    this.toggleModal(); 
  }

  //function for deleting a question from the database
  deleteQuestion = (e) => {
    this.toggleModal(); 

    let header = { 
      data: { termID: this.state.question.termID },
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    };

    axios.delete(this.props.serviceIP + '/term', header)
      .then( res => {
        this.props.updateCurrentModule({ module: this.props.curModule });  
      })
      .catch(error => {
        console.log("deleteQuestion in Question.js error: ", error);
      });
  }

  //function that toggles whether or not answers a visible
  toggleCollapsedAnswers = () => {
    this.setState({collapseAnswers: !this.state.collapseAnswers})
  }

  toggleModal = () => {
    this.setState({ modal: !this.state.modal })
  }

  toggleImgTooltipOpen = () => {
    this.setState({ imgTooltipOpen: !this.state.imgTooltipOpen }); 
  }

  toggleAudioTooltipOpen = () => {
    this.setState({ audioTooltipOpen: !this.state.audioTooltipOpen }); 
  }

  //function that deletes a answer from the list of answers
  handleDeleteAnswer = (event) => {
    var list = this.props.deleteAnswer(this.state.answers, event.answer);
    this.setState({
      answers: list
    })
  }

  //function that cancels the edit and sets everything back to what it was initially
  handleCancelEdit = (event) => {
    this.setState({
      question: this.props.question,
      modal: false,

      editMode: false,
      editedFront: this.props.question.front,
      collapseAnswers: false,
      
      selectedImgFile: this.props.question.imageLocation, 
      selectedAudioFile: this.props.question.audioLocation, 
      changedImage: false, 
      changedAudio: false, 

      answers: ["answer1", "answer2", "answer3"]
    })
  }


  render() {
    let {editedFront, editedBack, editedType, editedGender, selectedImgFile, selectedAudioFile} = this.state;
    let imgLink = "http://34.239.123.94/Images/" + selectedImgFile;
    let audioLink = "http://34.239.123.94/Audios/" + selectedAudioFile;

    if (this.state.editMode === false){
      return (
        <Fragment>
        <tr onClick={this.toggleCollapsedAnswers}>
          <td>{editedFront}</td>
          <td>{editedBack}</td>
          <td>{editedType}</td>
          <td>{editedGender}</td>
          <td>
            {/* favicon is just a placeholder for now more testing needs to be done after deployment */}
            <Button 
              style={{backgroundColor: 'white', width: '100%'}} 
              href="http://localhost:3000/favicon.ico" 
              download
              >
              <img 
                src={"./../../../image.png"} 
                alt="frame icon" 
                style={{width: '25px', height: '25px'}}
                />
            </Button>
          </td>
          <td>
            {/* audio has to be in the same domain */}
            <Button 
              style={{backgroundColor: 'white', width: '100%'}} 
              href={audioLink} 
              download
              > 
              <img 
                src={"./../../../headphones.png"} 
                alt="headphones icon" 
                style={{width: '25px', height: '25px'}}
                />
            </Button>
          </td>
          <td>{this.state.question.termID}</td>
          <td>
            <ButtonGroup>
              <Button style={{backgroundColor: 'lightcyan'}} onClick={() => this.editQuestion()}>
                <img 
                  src={"./../../../tools.png"} 
                  alt="edit icon" 
                  style={{width: '25px', height: '25px'}}
                  />
              </Button>
              <Button style={{backgroundColor: 'lightcoral'}} onClick={this.handleDelete.bind()}>
                <img 
                  src={"./../../../delete.png"} 
                  alt="trash can icon" 
                  style={{width: '25px', height: '25px'}}
                  />
              </Button>
            </ButtonGroup>

            <Modal isOpen={this.state.modal} toggle={this.toggleModal}> 
              <ModalHeader toggle={this.toggleModal}>Delete</ModalHeader>
              
              <ModalBody>
                <p>Are you sure you want to delete the question: {editedFront}?</p>
              </ModalBody>

              <ModalFooter>
                <Button onClick={this.toggleModal}>Cancel</Button>
                <Button color="danger" onClick={this.deleteQuestion.bind()}>Delete</Button>
              </ModalFooter>
            </Modal>

          </td>
        </tr>

        <tr>
          <td style={{border:"none"}} colSpan="8">
            <Collapse isOpen={this.state.collapseAnswers}>
            <AnswerButtonList 
              answers={this.state.answers} 
              handleDeleteAnswer={this.handleDeleteAnswer} 
              deletable={false}
              />
            </Collapse>
          </td>
        </tr>
        </Fragment>
      )
    } 
    else{
      return (
      <Fragment>

      <tr>
        <td>
        <Input 
          type="value" 
          name="editedFront"
          onChange={e => this.change(e)} 
          value={this.state.editedFront} 
          />
        </td>

        <td>
          <Input 
            type="value" 
            name="editedBack"
            onChange={e => this.change(e)} 
            value={this.state.editedBack} 
            />
        </td>

        <td>
          <CustomInput 
                            type="select" 
                            name="editedType" 
                            id="selectType"
                            value={this.state.editedType} 
                            onChange={e => this.change(e)}>

                            <option value="">Select</option>
                            <option value="NN">NN (Noun)</option>
                            <option value="VR">VR (Verb)</option>
                            <option value="AJ">AJ (Adjective)+</option>
                            <option value="AV">AV (Adverb)</option>
                    </CustomInput>
        </td>

        <td>
          <CustomInput 
                            type="select" 
                            name="editedGender" 
                            id="selectGender"
                            value={this.state.editedGender} 
                            onChange={e => this.change(e)}>

                            <option value="">Select</option>
                            <option value="MA">MA (Male)</option>
                            <option value="FE">FE (Female)</option>
                            <option value="NA">NA (Nongendered)</option>
                    </CustomInput>
        </td>

        <td>
          <input 
            style={{display: 'none'}}
            type="file" onChange={this.imgFileSelectedHandler}  
            ref={imgInput => this.imgInput = imgInput}
          />
          <Button 
            style={{backgroundColor: 'lightseagreen', width: '100%'}} 
            id="uploadImage"
            onClick={() => this.imgInput.click()}
            >
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
          <input 
            style={{display: 'none'}} 
            type="file" onChange={this.audioFileSelectedHandler}
            ref={audioInput => this.audioInput = audioInput}
          />
          <Button 
            style={{backgroundColor: 'lightseagreen', width: '100%'}} 
            id="uploadAudio"
            onClick={() => this.audioInput.click()}
            >
            <img 
              src={"./../../../uploadAudio.png"} 
              alt="Icon made by Srip from www.flaticon.com" 
              style={{width: '25px', height: '25px'}}
            />
          </Button>
          <Tooltip placement="top" isOpen={this.state.audioTooltipOpen} target="uploadAudio" toggle={this.toggleAudioTooltipOpen}>
            Upload Audio
          </Tooltip>
        </td>

        <td>{this.state.question.termID}</td>

        <td>
          <ButtonGroup>
            <Button 
              style={{backgroundColor: 'lightcyan', width: '25%', height: '100%', color: 'black'}} 
              onClick = {this.submitEdit}
              > 
              <img 
                src={"./../../../submit.png"} 
                alt="Icon made by Becris from www.flaticon.com" 
                style={{width: '25px', height: '25px'}}
              />
            </Button>
            <Button 
              style={{backgroundColor: 'lightcyan', width: '25%', height: '100%', color: 'black'}} 
              onClick = {this.handleCancelEdit}
              > 
              <img 
                src={"./../../../cancel.png"} 
                alt="Icon made by Freepik from www.flaticon.com" 
                style={{width: '25px', height: '25px'}}
              />
            </Button>
          </ButtonGroup>
        </td>

      </tr>

      <tr>
        <td style={{border:"none"}} colSpan="8">
          <AnswerButtonList 
            answers={this.state.answers} 
            handleDeleteAnswer={this.handleDeleteAnswer} 
            deletable={true}
            />
          Add Answer:
          <Autocomplete 
            name={"answers"}
            id={"answers"}
            placeholder={"Answer"}
            handleAddAnswer={this.handleAddAnswer}
            createAnswer={this.createAnswer}

            suggestions={this.props.allAnswers} 
            />
        </td>

      </tr>
      </Fragment>
      );
    }
    
  }
}

export default Question
