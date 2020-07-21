import React from 'react';
import { Button, Form, FormGroup, Label, Input, 
	CustomInput, Row, Col, Alert, Collapse} from 'reactstrap';
import axios from 'axios';

import AnswerButton from './AnswerButton';
import Autocomplete from './Autocomplete';
import AnswerButtonList from './AnswerButtonList';
import AddAnswer from './AddAnswer';

class AddQuestion extends React.Component {
	constructor(props) {
		super(props);

		this.change = this.change.bind(this);

		this.state = {
			
			front: "", //english translation of the word
			back: "", //foreign version of the word
			answers: [], //array of answers associated with word
			selectedImgFile: null, //file location of the picture selected
			selectedAudioFile: null, //file location of the audio selected

			imgLabel: "Pick an image for the question", 
			audioLabel: "Pick an audio for the question",

			submittingAnswer: false, //determines whether or not the AddAnswer form will be shown
			userCreatedAnswer: "", //what the user put in the field when they clicked create answer


      		//state properties below this point are never used, and we should probably delete them
			cardID: "" //id of card we're adding
		};
	}



	//function that sets the answerlist on this form
	updateAnswerButtonList = (answerButtonList) => {
		this.setState({answers: answerButtonList})
	}

	//function never gets used, consider deleting it
	updateDeckID(newID) {
		this.setState({
			id: newID,
		})
	}

	imgFileChangedHandler = (event) => {
		this.setState({
			selectedImgFile: event.target.files[0],
			imgLabel: event.target.files[0] === undefined ? "Pick an image for the question" : event.target.files[0].name
		})
	}

	audioFileChangedHandler = (event) => {
		this.setState({
			selectedAudioFile: event.target.files[0],
			audioLabel: event.target.files[0] === undefined ? "Pick an audio for the question" : event.target.files[0].name
		})
	}

	change(e) {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	//TODO: Make this actually work
	//function that submits the data
	submitQuestion = (e) => {
		console.log("Got into submitQuestion")

		if (this.state.front.length !== 0 && this.state.back.length !== 0)
		{   
			e.preventDefault();
			const data = new FormData(); 
			let header = {
				headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
				};

			//required fields for adding a question
			data.append('front', this.state.front); 
			data.append('back', this.state.back); 
			data.append('language', this.state.language); 

			//optional fields for adding a question
			if (this.state.type.length !== 0)
				data.append('type', this.state.type); 

			if (this.state.gender.length !== 0)
				data.append('gender', this.state.gender); 

			//map through all the answers and make a answer field object for them 
			this.state.answers.map((label) => {
				return ( data.append('answer', label) )
			})

			if (this.state.selectedImgFile !== null || this.state.selectedImgFile !== undefined)
				data.append('image', this.state.selectedImgFile);

			if (this.state.selectedAudioFile !== null || this.state.selectedAudioFile !== undefined)
				data.append('audio', this.state.selectedAudioFile);


			axios.post(this.props.serviceIP + '/question', data, header)
				.then(res => {
					this.props.updateCurrentModule({ module: this.props.curModule });
				}) 
				.catch(function (error) {
					console.log("submitQuestion error: ", error);
				});
		} else {
			e.preventDefault();
			alert("Please fill all inputs!");
		}
	}



	//TODO: handleAddAnswer and createAnswer kinda do the same thing. Maybe they should be one thing?
	//function that adds a answer to list of answers on this form
	handleAddAnswer = (event) => {
		
		//let list = this.props.addAnswer(this.state.answers, event.answer);

		let list = this.state.answers;
		let answerObject = this.props.allAnswers.find((answer) => {
			if(answer.front === event.answer){
				return true;
			} else{
				return false;
			}
		});

		list.push(answerObject);
		console.log("answerObject in handleAddAnswer: ", answerObject);

		this.setState({
			answers: list
		})
	}

	//function that adds a new answer from user input to list of answers on this form
	createAnswer = (answer) => {

		console.log("Got into createAnswer, answer: ", answer);

		this.setState({
			submittingAnswer: true,
			userCreatedAnswer: answer
		});
	}

	//function that allows user to cancel AddAnswer form
	cancelCreateAnswer = () => {
		this.setState({
			submittingAnswer: false
		})
	}

	//function that adds a newly created answer to the list of answers on this question
	addAnswerToList = (answer) => {
		let tempAnswers = this.state.answers;
		tempAnswers.push(answer);

		this.setState({
			answers: tempAnswers,
			submittingAnswer: false
		})
	}

	//function that removes a answer from the list of answers on this form
	handleDeleteAnswer = (event) => {

    let tempAnswerButtonList = this.state.answers;
    
    let answerObject = this.state.answers.find((answer) => {
    	if(answer.front === event.answer){
    		return true;
    	} else {
    		return false;
    	}
    });


    let answerIndex = tempAnswerButtonList.indexOf(answerObject);

    if(answerIndex !== -1){
      tempAnswerButtonList.splice(answerIndex, 1);
    }

    this.setState({
    	answers: tempAnswerButtonList
    })

	}

	render () {
		console.log("this.props.allAnswers: ", this.props.allAnswers.map((answer) => {return(answer.front)}))

	    return (
			<div>
			{this.state.id !== "" ? 
			<div>
			<Form onSubmit={e => this.submitQuestion(e)}>
				<input type="hidden" value="prayer" />
				
				<br/>

				<Alert style={{color: '#004085', backgroundColor: 'deepskyblue'}}>
				<Row>
					<Col>
						<FormGroup>			
							<Label for="front">
								Question:
							</Label>

							<Input type="text"
							name="front"
							onChange={e => this.change(e)}
							value={this.state.front}
							id="front"
							placeholder="Question" 
							autoComplete="off"/>
						</FormGroup>
					</Col>
				</Row>

				<Row>
					<Col>
						<Label for="answers">
							Answers:
						</Label>

						<br/>
						
						<FormGroup width="50%">
							<Autocomplete 
								name={"answers"}
								id={"answers"}
								placeholder={"Answer"}
								handleAddAnswer={this.handleAddAnswer}
								createAnswer={this.createAnswer}

								suggestions={this.props.allAnswers.map((answer) => {return(answer.front)})} 
						    />
					    </FormGroup>


					    
					    {/*Lists all of the answers on this question, displayed as buttons*/}
						<Alert color="warning">
							<AnswerButtonList 
							answers={this.state.answers.map((answer) => { 
									return(answer.front)}
									)} 
							handleDeleteAnswer={this.handleDeleteAnswer} 
							updateAnswerButtonList={this.updateAnswerButtonList} 
							deletable={true}
							/>
						</Alert>
					
					</Col>
				</Row>

				<Row>
					<Col>
						<FormGroup>
							<Label for="imgFile">
								Image:
							</Label>

							<CustomInput 
							type="file" 
							id="imgFile" 
							label={this.state.imgLabel} 
							onChange={this.imgFileChangedHandler}
							/>
						</FormGroup>
					</Col>
					
					<Col>
						<FormGroup>
							<Label for="audioFile">
								Audio:
							</Label>

							<CustomInput 
								type="file" 
								id="audioFile" 
								label={this.state.audioLabel} 
								onChange={this.audioFileChangedHandler}
								/>
						</FormGroup>
					</Col>
				</Row>
				
				<Row>
					<Col>
						<Button style={{backgroundColor: '#004085'}} type="submit" block>
							Create
						</Button>
					</Col>
				</Row>
				</Alert>
			</Form> 

		{/*TODO: make the screen focus on this after it gets opened*/}
			<Collapse isOpen={this.state.submittingAnswer}>
					    	
				<AddAnswer
					curModule={this.props.curModule} 
					updateCurrentModule={this.props.updateCurrentModule}
					serviceIP={this.props.serviceIP}
					deleteTag={this.props.deleteTag}
					addTag={this.props.addTag}
					allTags={this.props.allTags}
					front={this.state.userCreatedAnswer}

					cancelCreateAnswer={this.cancelCreateAnswer}
					addAnswerToList={this.addAnswerToList}
				/>
							
			</Collapse>
			</div>: null  }</div>
	)
	}
}

export default AddQuestion;