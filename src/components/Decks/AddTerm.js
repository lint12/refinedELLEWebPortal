import React from 'react';
import { Button, Form, FormGroup, Label, Input, CustomInput, Row, Col, Alert} from 'reactstrap';
import axios from 'axios';

import TagList from './TagList';
import Autocomplete from './Autocomplete';

class AddTerm extends React.Component {
	constructor(props) {
		super(props);

		this.change = this.change.bind(this);

		this.state = {
			
			front: "", //english translation of the word
			back: "", //foreign version of the word
			type: "", //NN, VR, AJ, AV, PH
			gender: "", //MA, FE, NA
			tags: [], //array of tags associated with word
			selectedImgFile: null, //file location of the picture selected
			selectedAudioFile: null, //file location of the audio selected

			imgLabel: "Pick an image for the term", 
			audioLabel: "Pick an audio for the term",


      		//state properties below this point are never used, and we should probably delete them
			cardID: "" //id of card we're adding
		};
	}


	//function that sets the taglist on this form
	updateTagList = (tagList) => {
		this.setState({tags: tagList})
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
			imgLabel: event.target.files[0] === undefined ? "Pick an image for the term" : event.target.files[0].name
		})
	}

	audioFileChangedHandler = (event) => {
		this.setState({
			selectedAudioFile: event.target.files[0],
			audioLabel: event.target.files[0] === undefined ? "Pick an audio for the term" : event.target.files[0].name
		})
	}

	change(e) {
	    this.setState({
	      [e.target.name]: e.target.value
		})
  	}

  	//function that submits the data
	submitTerm = (e) => {
		console.log("FRONT: ", this.state.front)
		console.log("BACK: ", this.state.back)
		console.log("TAGS: ", this.state.tags)
		console.log("TYPE: ", this.state.type)
		console.log("GENDER: ", this.state.gender)
		console.log("IMG: ", this.state.selectedImgFile)
		console.log("Audio: " ,this.state.selectedAudioFile)
		console.log("language: ", this.props.curModule.language)
		console.log("id: ", this.props.curModule.moduleID)

		if (this.state.front.length !== 0 && this.state.back.length !== 0)
		{   
			e.preventDefault();
			const data = new FormData(); 
			let header = {
				headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
				};

			//required fields for adding a term
			data.append('front', this.state.front); 
			data.append('back', this.state.back); 
			data.append('language', this.state.language); 

			//optional fields for adding a term
			if (this.state.type.length !== 0)
				data.append('type', this.state.type); 

			if (this.state.gender.length !== 0)
				data.append('gender', this.state.gender); 

			//map through all the tags and make a tag field object for them 
			this.state.tags.map((label) => {
				return ( data.append('tag', label) )
			})

			if (this.state.selectedImgFile !== null || this.state.selectedImgFile !== undefined)
				data.append('image', this.state.selectedImgFile);

			if (this.state.selectedAudioFile !== null || this.state.selectedAudioFile !== undefined)
				data.append('audio', this.state.selectedAudioFile);


			axios.post(this.props.serviceIP + '/term', data, header)
				.then(res => {
					this.props.updateCurrentModule({ module: this.props.curModule });
				}) 
				.catch(function (error) {
					console.log("submitTerm error: ", error);
				});
		} else {
			e.preventDefault();
			alert("Please fill all inputs!");
		}
  }


  //TODO: handleAddTag and createTag kinda do the same thing. Maybe they should be one thing?
  //function that adds a tag to list of tags on this form
  handleAddTag = (event) => {
  	
  	let list = this.props.addTag(this.state.tags, event.tag);


  	this.setState({
  		tags: list
  	})
  }

  //function that adds a new tag from user input to list of tags on this form
  createTag = (tag) => {

  	console.log("Got into createTag, tag: ", tag);

  	let tempTags = this.state.tags;
  	tempTags.push(tag);
  	this.setState({
  		tags: tempTags
  	});
  }

  //function that removes a tag from the list of tags on this form
  handleDeleteTag = (event) => {
  	let list = this.props.deleteTag(this.state.tags, event.tag);
  	this.setState({
  		tags: list
  	})
  }

render () {
    return (
		<div>
		{this.state.id !== "" ? 
		<Form onSubmit={e => this.submitTerm(e)}>
			<input type="hidden" value="prayer" />
			
			<br/>

			<Alert style={{color: '#004085', backgroundColor: 'deepskyblue'}}>
			<Row>
				<Col>
					<FormGroup>			
						<Label for="front">
							English Word:
						</Label>

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
						<Label for="back">
							Translated Word:
						</Label>

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
					<FormGroup>
						<Label for="selectType">
							Type:
						</Label>

						<CustomInput 
							type="select" 
							name="type" 
							id="selectType"
							value={this.state.type} 
							onChange={e => this.change(e)}>

							<option value="">Select</option>
							<option value="NN">NN (Noun)</option>
							<option value="VR">VR (Verb)</option>
							<option value="AJ">AJ (Adjective)+</option>
							<option value="AV">AV (Adverb)</option>
							{/* <option value="PH">PH (Phrase)</option> */}

						</CustomInput>
					</FormGroup>
				</Col>

				<Col>
					<FormGroup>
						<Label for="selectGender">
							Gender:
						</Label>
						
						<CustomInput 
							type="select" 
							name="gender" 
							id="selectGender" 
							value={this.state.gender} 
							onChange={e => this.change(e)}>

							<option value="">Select</option>
							<option value="MA">MA (Male)</option>
							<option value="FE">FE (Female)</option>
							<option value="NA">NA (Nongendered)</option>

						</CustomInput>
					</FormGroup>
				</Col>
			</Row>
			
			<Row>
				<Col>
					<Label for="tags">
						Tags:
					</Label>

					<br/>
					
					<FormGroup width="50%">
						<Autocomplete 
							name={"tags"}
							id={"tags"}
							placeholder={"Tag"}
							handleAddTag={this.handleAddTag}
							createTag={this.createTag}

							suggestions={this.props.allTags} 
					    />
				    </FormGroup>
				    
				    {/*Lists all of the tags on this term, displayed as buttons*/}
					<Alert color="warning">
				    	<TagList 
				    	tags={this.state.tags} 
				    	handleDeleteTag={this.handleDeleteTag} 
				    	updateTagList={this.updateTagList} 
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
		</Form> : null  }</div>
)
}
}

export default AddTerm;