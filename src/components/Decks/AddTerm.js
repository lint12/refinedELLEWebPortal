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
			cardID: "", //id of card we're adding
			front: "", //english translation of the word
			back: "", //foreign version of the word
			type: "", //NN, VR, AJ, AV, PH
			gender: "", //MA, FE, NA
			tags: [], //array of tags associated with word
			selectedImgFile: null, //file location of the picture selected
			selectedAudioFile: null, //file location of the audio selected

			imgLabel: "Pick an image for the term", 
			audioLabel: "Pick an audio for the term"
		};
	}

	componentDidMount(){
		//TODO: populate this.state.allTags
		//TODO: 
	}

	updateTagList = (tagList) => {
		this.setState({tags: tagList})
	}

	//updates the deck id to a new id
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
  	//TODO: adapt to current database
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

			if (this.state.selectedImgFile !== undefined || this.state.selectedImgFile !== undefined)
				data.append('image', this.state.selectedImgFile);

			if (this.state.selectedAudioFile !== undefined || this.state.selectedAudioFile !== undefined)
				data.append('audio', this.state.selectedAudioFile);

			axios.post(this.props.serviceIP + '/term', data, 
				{headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
			}).then(res => {
				console.log(res.data);
				this.props.updateCurrentModule({ module: this.props.curModule });
			}) 
			.catch(function (error) {
				console.log(error);
			});
		} else {
			e.preventDefault();
			alert("Please fill all inputs!");
		}
  }

  handleAddTag = (event) => {
  	console.log("Got into handleAddTag, tag: ", event.tag);
  	console.log("this.state.tags in addTerm: ", this.state.tags);
  	
  	let list = this.props.addTag(this.state.tags, event.tag);

  	console.log("list in handleAddTag after addTag is called: ", list);

  	this.setState({
  		tags: list
  	})
  }


  createTag = (tag) => {
  	//TODO: create function that creates a brand new tag from the user input,
  	//adds that tag to the database, and associates that tag with the word being created
  	//And pass that function into Autocomplete

  	console.log("Got into createTag, tag: ", tag);

  	let tempTags = this.state.tags;
  	tempTags.push(tag);
  	this.setState({
  		tags: tempTags
  	});
  }

  handleDeleteTag = (event) => {
  	let list = this.props.deleteTag(this.state.tags, event.tag);
  	this.setState({
  		tags: list
  	})
  }

render () {
	console.log("IDDDDD: ", this.props.id);
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
					<FormGroup>
						<Label for="selectType">Type:</Label>
						<CustomInput type="select" name="type" id="selectType"
						value={this.state.type} onChange={e => this.change(e)}>
							<option value="">Select</option>
							<option value="NN">NN (Noun)</option>
							<option value="VR">VR (Verb)</option>
							<option value="AJ">AJ (Adjective)+</option>
							<option value="AV">AV (Adverb)</option>
							<option value="PH">PH (Phrase)</option>
						</CustomInput>
					</FormGroup>
				</Col>

				<Col>
					<FormGroup>
						<Label for="selectGender">Gender:</Label>
						<CustomInput type="select" name="gender" id="selectGender" 
						value={this.state.gender} onChange={e => this.change(e)}>
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
					<Label for="tags">Tags:</Label><br/>
					<FormGroup width="50%">
						{console.log("this.props.allTags: ", this.props.allTags)}
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
				    <TagList tags={this.state.tags} handleDeleteTag={this.handleDeleteTag} 
				    updateTagList={this.updateTagList} deletable={true}
				    />
					</Alert>
				    
				</Col>
			</Row>

			<Row>
				<Col>
					<FormGroup>
						<Label for="imgFile">Image:</Label>
						<CustomInput type="file" id="imgFile" label={this.state.imgLabel} onChange={this.imgFileChangedHandler}/>
					</FormGroup>
				</Col>
				
				<Col>
					<FormGroup>
						<Label for="audioFile">Audio:</Label>
						<CustomInput type="file" id="audioFile" label={this.state.audioLabel} onChange={this.audioFileChangedHandler}/>
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