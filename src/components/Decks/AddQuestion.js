import React from 'react';
import { Button, Form, FormGroup, Label, Input, Row, FormText, Col, Alert} from 'reactstrap';
import axios from 'axios';

import Autocomplete from './Autocomplete';
import TermList from './TermList';

class AddTerm extends React.Component {
	constructor(props) {
		super(props);

		this.change = this.change.bind(this);
		this.getAllTags = this.getAllTags.bind(this);

		this.state = {
			cardID: "", //id of card we're adding
			id: this.props.id, //id of deck we're adding the card to
			question: "", //question being asked
			thisAnswer: "", //answer that the user is inputting right now
			answers: [], //array of answers that answer the question
			difficulty: 1, //unused information
			selectedPicFile: null, //file location of the picture selected
			selectedAudioFile: null, //file location of the audio selected

			allTags: [], //list of all tags in the database

			allTerms: [] //list of all terms in the database

		};
	}

	//updates the deck id to a new id
	updateDeckID(newID) {
		this.setState({
			id: newID,
		})
	}

	picFileChangedHandler = (event) => {
	  this.setState({
			selectedPicFile: event.target.files[0]
		})
	}

	audioFileChangedHandler = (event) => {
		this.setState({
			selectedAudioFile: event.target.files[0]
		})
	}

	change(e) {
	    this.setState({
	      [e.target.name]: e.target.value
	    })
  	}

  	getAllTags = () => {
  		console.log("getAllTags");
  	}

  	componentDidMount(){
  		this.getAllTags();
  	}

  	//function that submits the data
	submitQuestion(event) {
		if (this.state.front != null && this.state.back != null)
		{

		    event.preventDefault();
			
			const formPicData = new FormData();
			formPicData.append('file', this.state.selectedPicFile);
			
			const formAudioData = new FormData();
			formAudioData.append('file', this.state.selectedAudioFile);
		    
		    var data = {
					front: this.state.front,
					back: this.state.back,
					cardName: this.state.cardName,
					difficulty: this.state.difficulty,
		    }

			var fileheader = {
				'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
				'Content-Type': 'multipart/form-data'
			}

		    var headers = {
		        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
		    }

			axios.post(this.props.serviceIP + '/card/'+this.state.id, data, {headers:headers})
			.then(res => {
				console.log(res.data);
				axios.post(this.props.serviceIP + '/card/image/'+res.data.cardID, formPicData, {headers:fileheader})
				.then(res => {
					console.log(res.data);
					})
					.catch(function (error) {
						console.log(error);
					});
				axios.post(this.props.serviceIP + '/card/sound/'+res.data.cardID, formAudioData, {headers:fileheader})
				.then(res => {
					console.log(res.data);
				})
				.catch(function (error) {
					console.log(error);
				});
			})
			.catch(function (error) {
				console.log(error);
			});
		} else {
			alert("Please fill all inputs!");
		}
  }

		render () {
	    return (
			<div>
			{this.state.id !== "" ? 
			<Form onSubmit={event => this.submitQuestion(event)}>

				<br></br>

				<Alert style={{color: '#004085', backgroundColor: 'deepskyblue'}}>
				<Row>
					<Col>
						<FormGroup>
							
							<Label for="question">Question:</Label>
							
							<Input type="text"
							name="question"
							onChange={e => this.change(e)}
							value={this.state.question}
							id="question"
							placeholder="Question" />
						</FormGroup>
					</Col>
				</Row>
				
				<Row>
					<Col>
						<FormGroup>
							
							<Label for="back">Answers:</Label>
							
							<Autocomplete 
								name={"answers"}
								id={"answers"}
								placeholder={"Answer"}
								suggestions={[
										"Fruit",
										"Vegetable",
										"Plant",
										"Animal",
										"Food",
										"Family",

							        ]} 
						    />
					    </FormGroup>
					</Col>
				</Row>
				
				<Row>
					<Col>
						{/*
						<FormGroup>
							<Label for="tags">Tags:</Label>
							<Input type="text"
							name="tags"
							onChange={e => this.change(e)}
							value={this.state.tags}
							id="tags"
							placeholder="Tags" />
						</FormGroup>
						*/}
						

					    
					    <TermList terms={[
							"noun",
							"fruit",
							"plant"
				    		]}
				    	/>

					    

					</Col>
				</Row>

				<Row>
					<Col>
						<FormGroup>
							
							<Label for="picFile">Picture: </Label>
							
							<Input type="file" onChange={this.picFileChangedHandler} />
							
							<FormText color="muted">
								Pick an actual Image for the term.
							</FormText>
						</FormGroup>
					</Col>
					
					<Col>
						<FormGroup>
							
							<Label for="audioFile">Audio File: </Label>
							
							<Input type="file" onChange={this.audioFileChangedHandler} />
							
							<FormText color="muted">
								Pick an audio file for the term.
							</FormText>
						</FormGroup>
					</Col>
				</Row>
				<Row>
					<Col>
						<Button style={{backgroundColor: '#004085'}} type="submit" block>Create</Button>
					</Col>
				</Row>
				</Alert>
			</Form> : null  }</div>
	)
	}
}

export default AddTerm
