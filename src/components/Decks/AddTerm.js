import React from 'react';
import { Button, Form, FormGroup, Label, Input, Row, FormText, Col, Alert} from 'reactstrap';
import axios from 'axios';

import TagList from './TagList';
import Autocomplete from './Autocomplete';

class AddTerm extends React.Component {
	constructor(props) {
		super(props);

		this.change = this.change.bind(this);

		this.state = {
			cardID: "", //id of card we're adding
			id: this.props.id, //id of deck we're adding the card to
			front: "", //english translation of the word
			back: "", //foreign version of the word
			tags: ["tag1", "tag2", "tag3"], //array of tags associated with word
			difficulty: 1, //unused information
			selectedPicFile: null, //file location of the picture selected
			selectedAudioFile: null, //file location of the audio selected

			allTags: [] //list of all tags in the database

		};
	}

	componentDidMount(){
		//TODO: populate this.state.allTags
		//TODO: 
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
  	//TODO: adapt to current database
  	//function that submits the data
	submitTerm(e) {
		if (this.state.front != null && this.state.back != null)
		{

		    e.preventDefault();
			
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

  addTag = (tag) => {
  	console.log("Got into addTag, tag: ", tag);
  	
  	let temp = this.state.tags;

  	temp.push(tag);

  	this.setState({tags: temp});
  }

  deleteTag = (tag) => {
  	//TODO: create function that delete a tag from the database, given the tag
  	//And pass that function into autocomplete
  }

  createTag = (tag) => {
  	//TODO: create function that creates a brand new tag from the user input,
  	//adds that tag to the database, and associates that tag with the word being created
  	//And pass that function into Autocomplete
  }

render () {
    return (
		<div>
		{this.state.id !== "" ? 
		<Form onSubmit={e => this.submitTerm(e)}>
			<input type="hidden" value="prayer" />
			<br></br>

			<Alert style={{color: '#004085', backgroundColor: 'deepskyblue'}}>
			<Row>
				<Col>
					<FormGroup>
						
						<Label for="front">English Word:</Label>
						
						<Input type="text"
						name="front"
						onChange={e => this.change(e)}
						value={this.state.front}
						id="front"
						placeholder="English Word" 
						autoComplete="off"/>
					</FormGroup>
				</Col>
			</Row>
			
			<Row>
				<Col>
					<FormGroup>
						
						<Label for="back">Translated Word:</Label>
						
						<Input type="text"
						name="back"
						onChange={e => this.change(e)}
						value={this.state.back}
						id="back"
						placeholder="Translated Word" />
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
					
					{/*input field for putting in tags. Is an autocomplete field. suggestions should
					be all existing tags in database, after hooked up to current database.
					TODO: Make it so that when a user presses enter on an input in autocomplete, it updates
					this component's tag list*/}
					<Label for="back">Tags:</Label><br/>
					<FormGroup width="50%">
						<Autocomplete 
							name={"tags"}
							id={"tags"}
							placeholder={"Tag"}
							onEnter={this.addTag}

							suggestions={[
								"Noun",
								"Verb",
								"Fruit",
								"Vegetable",
								"Place",
								"Animal",
								"food"

					        ]} 
					    />

				    </FormGroup>
				    
				    {/*Lists all of the tags on this term, displayed as buttons*/}
				    <TagList tags= {this.state.tags}
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

export default AddTerm;