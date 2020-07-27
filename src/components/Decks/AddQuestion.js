import React from 'react';
import { Button, Form, FormGroup, Label, Input, 
	CustomInput, Row, Col, Alert, Modal, ModalHeader, ModalBody} from 'reactstrap';
import axios from 'axios';

import AnswerButton from './AnswerButton';
import Autocomplete from './Autocomplete';
import AnswerButtonList from './AnswerButtonList';
import AddAnswer from './AddAnswer';
import SearchAnswersByTag from './SearchAnswersByTag'

class AddQuestion extends React.Component {
	constructor(props) {
		super(props);

		this.change = this.change.bind(this);

		this.state = {
			questionText: "",//text of the longform question being asked
			front: "", //english translation of the word
			answers: [], //array of answers associated with word
			newlyCreatedAnswers : [], //array of answers the user created via this form
			newlyCreatedAnswersIDArray: [], //array that stores IDs of new answers after they're added
			selectedImgFile: null, //file location of the picture selected
			selectedAudioFile: null, //file location of the audio selected
			type: [],

			validAnswers: [],
			prevValidAnswers: [],

			imgLabel: "Pick an image for the question", 
			audioLabel: "Pick an audio for the question",

			submittingAnswer: false, //determines whether or not the AddAnswer form will be shown
			userCreatedAnswer: "", //what the user put in the field when they clicked create answer

			searchingByTag: false,

			questionID: "",
		};
	};

	componentDidMount() {
		this.setValidAnswers();
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
	//needs to submit the question, and then make a request to add answers to question

	submitQuestion = (e) => {
		console.log("Got into submitQuestion")

		if (this.state.questionText.length !== 0)
		{   
			e.preventDefault();
			const data = new FormData(); 
			let header = {
				headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
				};

			//required fields for adding a question
			data.append('questionText', this.state.questionText);

			//optional fields for adding a question
			
			data.append('type', "LONGFORM"); 

			data.append('moduleID', this.props.curModule.moduleID)


			if (this.state.selectedImgFile !== null || this.state.selectedImgFile !== undefined)
				data.append('image', this.state.selectedImgFile);

			if (this.state.selectedAudioFile !== null || this.state.selectedAudioFile !== undefined)
				data.append('audio', this.state.selectedAudioFile);


			axios.post(this.props.serviceIP + '/question', data, header)
				.then(res => {
					console.log("res.data in submitQuestion: ", res.data);
					//TODO: change the backend so this is how it actually works
					this.setState({
						questionID: res.data.questionID
					})

					for(let i = 0; i < this.state.newlyCreatedAnswers.length; i++){
						this.createNewAnswer(this.state.newlyCreatedAnswers[i]);
					}

					this.submitAnswers();

					this.resetFields();
					this.props.updateCurrentModule({ module: this.props.curModule });
				}) 
				.catch(function (error) {
					console.log("submitQuestion error: ", error);
				});
		} else {
			e.preventDefault();
			alert("Please fill all inputs!sdfasfdasf");
		}
	}


	submitAnswers = () => {
		console.log("Got into submitAnswers");

		for(let i = 0; i < this.state.answers.length; i++){
			console.log("going into submitIndividualAnswer, this.state.answers[i]: ", this.state.answers[i])
			this.submitIndividualAnswer(this.state.answers[i]);
		}
	}

	submitIndividualAnswer = (answer) => {

		console.log("questionID in submitIndividualAnswer: ", this.state.questionID);
		console.log("answerID in submitIndividualAnswer: ", answer.id);

		let header = {
			headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
		}

		let data = {
			questionID: this.state.questionID,
			termID: answer.id
		}

		axios.post(this.props.serviceIP + '/addAnswer', data, header)
			.then(res => {
				console.log("res.data in submitIndividualAnswer: ", res.data)
			})
			.catch(error => {
				console.log("error in submitIndividualAnswer: ", error)
			})
	}

	createNewAnswer = (answer) => {
		let header = {
			headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
			};

		console.log("in createNewAnswer")
		console.log("FRONT: ", answer.front)
		console.log("BACK: ", answer.back)
		console.log("TAGS: ", answer.tags)


		if (answer.front.length !== 0 && answer.back.length !== 0)
		{   
			//e.preventDefault();
			const data = new FormData(); 
			

			//required fields for adding a term
			data.append('front', answer.front); 
			data.append('back', answer.back); 
			data.append('moduleID', this.props.curModule.moduleID); 
			data.append('language', this.props.curModule.language); 


			//map through all the tags and make a tag field object for them 
			answer.tags.map((label) => {
				return ( data.append('tag', label) )
			})

			console.log("in createNewAnswer for addQuestion. input data: ", data);
			axios.post(this.props.serviceIP + '/term', data, header)
				.then(async res => {
					console.log("res.data in createNewAnswer: ", res.data); 

					//this.submitIndividualAnswer({ id: res.data.termID })

					let data = {
						questionID: this.state.questionID,
						termID: res.data.termID
					}

					console.log("Nested data: ", data); 
			
					await axios.post(this.props.serviceIP + '/addAnswer', data, header)
						.then(res => {
							console.log("res.data in nested axios request: ", res.data)
							this.props.updateCurrentModule({module: this.props.curModule})
						})
						.catch(error => {
							console.log("error in nested axios request: ", error)
					})

				}) 
				.catch(function (error) {
					console.log("createNewAnswer error: ", error);
				});
		} else {
			//e.preventDefault();
			alert("Please fill all inputs!");
		}
	}


	//TODO: handleAddAnswer and createAnswer kinda do the same thing. Maybe they should be one thing?
	//function that adds an existing term as an answer
	handleAddAnswer = (event) => {
		
		//let list = this.props.addAnswer(this.state.answers, event.answer);

		let list = this.state.answers;
		let answerObject = this.props.allAnswers.find(
			(answer) => {
				if(answer.front === event.answer){
					return true;
				} else{
					return false;
				}
			});

		if(answerObject === undefined){
			answerObject = this.props.allAnswers.find(
				(answer) => {
					if(answer.back === event.answer){
						return true;
					} else{
						return false;
					}
				})
		}

		list.push(answerObject);
		console.log("answerObject in handleAddAnswer: ", answerObject);

		this.setState({
			answers: list
		})

		this.setValidAnswers();
	}

	//function that adds a new answer from user input to list of answers on this form
	createAnswer = (answer) => {

		console.log("Got into createAnswer, answer: ", answer);

		this.setState({
			submittingAnswer: true,
			userCreatedAnswer: answer
		});
	}

	toggleSearchByTagForm = () => {
		this.setState({
			searchingByTag: !this.state.searchingByTag
		})
	}

	//function that allows user to cancel AddAnswer form
	cancelCreateAnswer = () => {
		this.setState({
			submittingAnswer: false
		})
	}

	//function that adds a newly created answer to the list of answers on this question
	addNewAnswerToList = (answer) => {
		let tempNewlyCreatedAnswers = this.state.newlyCreatedAnswers;
		tempNewlyCreatedAnswers.push(answer);

		this.setState({
			newlyCreatedAnswers: tempNewlyCreatedAnswers,
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

		this.setValidAnswers();

	}

	handleDeleteNewAnswer = (event) => {

		let tempAnswerButtonList = this.state.newlyCreatedAnswers;
		
		let answerObject = this.state.newlyCreatedAnswers.find((answer) => {
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
			newlyCreatedAnswers: tempAnswerButtonList
		})

	}

	//clears the input fields of the addQuestion form 
	//cannot however change questionID back to blank or else adding a newly created term as an answer would not work 
	//questionID itself will be updated correctly when the addQuestion API request is called
	resetFields = () => {
		this.setState({
			questionText: "",
			front: "", 
			answers: [], 
			newlyCreatedAnswers : [], 
			newlyCreatedAnswersIDArray: [], 
			selectedImgFile: null, 
			selectedAudioFile: null, 
			type: [],

			imgLabel: "Pick an image for the question", 
			audioLabel: "Pick an audio for the question",

			submittingAnswer: false, 
			userCreatedAnswer: "", 
		})

		this.setValidAnswers();

	}

	arraysEqual = (array1, array2) => {
	  if (array1 === array2) return true;
	  if (array1 == null || array2 == null) return false;
	  if (array1.length !== array2.length) return false;

	  for (var i = 0; i < array2.length; ++i) {
	    if (array1[i] !== array2[i]) return false;
	  }
	  return true;
	}

	setValidAnswers = () => {
		console.log("in addQuestion, setting autocomplete suggstions, this.props.allAnswers: ", this.props.allAnswers)
		let tempValidAnswers = this.props.allAnswers;
		tempValidAnswers.filter(
			(suggestion) => {
				if(this.state.answers.indexOf(suggestion) === -1){
					return true;
				} else{
					return false;
				}
			}
		)

		this.setState({
			validAnswers: tempValidAnswers,
		})
	}

	render () {
		console.log("in addQuestion, this.state.validAnswers: ", this.state.validAnswers)
	    
		let newValidAnswers = this.props.allAnswers.filter(
			(suggestion) => {
				if(this.state.answers.indexOf(suggestion) === -1){
					return true;
				} else{
					return false;
				}
			}
		)

		if(!this.arraysEqual(newValidAnswers, this.state.prevValidAnswers)){
			this.setState({
				validAnswers: newValidAnswers,
				prevValidAnswers: newValidAnswers
			})
		}

	    return (
		
			
			<div>
			<Form onSubmit={e => this.submitQuestion(e)}>
				<input type="hidden" value="prayer" />
				
				<br/>

				<Alert style={{color: '#004085', backgroundColor: 'indianred'}}>
				<Row>
					<Col>
						<FormGroup>			
							<Label for="questionText">
								Question:
							</Label>

							<Input type="text"
							name="questionText"
							onChange={e => this.change(e)}
							value={this.state.questionText}
							id="questionText"
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
						
							<FormGroup width="200%">
								<Autocomplete 
									name={"answers"}
									id={"answers"}
									placeholder={"Answer"}
									handleAddAnswer={this.handleAddAnswer}
									createAnswer={this.createAnswer}
									renderButton={true}
									autoCompleteStyle={{borderWidth: '0px', borderStyle: "none", width: "100%"}}

									suggestions={this.state.validAnswers
												.map((answer) => {return(answer.front)})
													.concat(this.state.validAnswers
														.map((answer) => {return(answer.back)})
														)
														.filter((answer, i, allAnswers) => {
															if(allAnswers.indexOf(answer) !== i){
																return false;
															} else{
																return true;
															}
														})
												}
							    />
						    </FormGroup>
					</Col>
						    
					<Col>
						<br/>
						    <Button onClick={this.toggleSearchByTagForm}>
						    	Search By Tag
						    </Button>
				   	</Col>
	
				</Row>

				<Row>
					<Col>
						<Alert color="warning">
							<Label> Answers: </Label>
							<AnswerButtonList 
							answers={this.state.answers.map((answer) => { 
									return(answer.front)}
									)} 
							handleDeleteAnswer={this.handleDeleteAnswer} 
							deletable={true}
							/>
							
							<AnswerButtonList
							answers={this.state.newlyCreatedAnswers.map((answer) =>{
									return(answer.front)}
									)}
							handleDeleteAnswer={this.handleDeleteNewAnswer}
							deletable={true}
							/>
						</Alert>
					</Col>
				</Row>

				<Row>
					<Col>
						<FormGroup>
							<Label for="qstImgFile">
								Image:
							</Label>

							<CustomInput 
							type="file" 
							accept=".png, .jpg, .jpeg" 
							id="qstImgFile" 
							label={this.state.imgLabel} 
							onChange={this.imgFileChangedHandler}
							/>
						</FormGroup>
					</Col>
					
					<Col>
						<FormGroup>
							<Label for="qstAudioFile">
								Audio:
							</Label>

							<CustomInput 
								type="file" 
								accept=".ogg, .wav, .mp3" 
								id="qstAudioFile" 
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
						<Button style={{backgroundColor: 'crimson'}} onClick={() => this.props.setOpenForm(0)} block>
							Cancel
						</Button>
					</Col>
				</Row>
				</Alert>
			</Form> 

		{/*TODO: make the screen focus on this after it gets opened*/}
			<Modal isOpen={this.state.submittingAnswer}>
				
				<ModalHeader>
					Add Answer: 
				</ModalHeader>
				<ModalBody>
					<AddAnswer
						curModule={this.props.curModule} 
						updateCurrentModule={this.props.updateCurrentModule}
						serviceIP={this.props.serviceIP}
						deleteTag={this.props.deleteTag}
						addTag={this.props.addTag}
						allTags={this.props.allTags}
						front={this.state.userCreatedAnswer}
						initialFront={this.state.userCreatedAnswer}

						cancelCreateAnswer={this.cancelCreateAnswer}
						addNewAnswerToList={this.addNewAnswerToList}
					/>
				</ModalBody>
							
			</Modal>

			<Modal isOpen={this.state.searchingByTag}>

				<ModalHeader>
					Search By Tag
				</ModalHeader>

				<ModalBody>
					<SearchAnswersByTag
						curModule={this.props.curModule} 
						updateCurrentModule={this.props.updateCurrentModule}
						serviceIP={this.props.serviceIP}
						deleteTag={this.props.deleteTag}
						addTag={this.props.addTag}
						allTags={this.props.allTags}
						allAnswers={this.props.allAnswers}
						

					>
					</SearchAnswersByTag>
				</ModalBody>

			</Modal>
			</div>
	)
	}
}

export default AddQuestion;