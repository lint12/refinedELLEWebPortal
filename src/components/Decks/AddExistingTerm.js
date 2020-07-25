import React from 'react';
import { Button, Form, FormGroup, Label, Input, CustomInput, Row, Col, Alert} from 'reactstrap';
import axios from 'axios';

import TagList from './TagList';
import Autocomplete from './Autocomplete';

class AddExistingTerm extends React.Component {
	constructor(props) {
		super(props);

		this.change = this.change.bind(this);

		this.state = {
			search: "",
			tags: [] //array of tags associated with word
		};
	}


	//function that sets the taglist on this form
	updateTagList = (tagList) => {
		this.setState({tags: tagList})
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
			data.append('moduleID', this.props.curModule.moduleID); 
			data.append('language', this.props.curModule.language); 

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

			console.log("in submitTerm for AddExistingTerm. input data: ", data);
			axios.post(this.props.serviceIP + '/term', data, header)
				.then(res => {
					console.log(res.data); 
					this.resetFields(); 
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

  resetFields = () => {
	  this.setState({
		front: "", 
		back: "", 
		type: "", 
		gender: "", 
		tags: [], 
		selectedImgFile: null, 
		selectedAudioFile: null, 

		imgLabel: "Pick an image for the term", 
		audioLabel: "Pick an audio for the term",
	  })
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
		
		<Form onSubmit={e => this.submitTerm(e)}>
			<input type="hidden" value="prayer" />
			
			<br/>

			<Alert style={{color: '#004085', backgroundColor: 'deepskyblue'}}>
			<Row>
				<Col>
					<FormGroup>			
						<Label for="search">
							Search:
						</Label>

						<Input type="text"
						name="search"
						onChange={e => this.change(e)}
						value={this.state.front}
						id="search"
						placeholder="Search" 
						autoComplete="off"/>
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
							renderButton={false}

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
					<Button style={{backgroundColor: '#004085'}} type="submit" block>
						Create
					</Button>
					<Button style={{backgroundColor: 'crimson'}} onClick={this.props.toggleExistingCard} block>
						Cancel
					</Button>
				</Col>
			</Row>
			</Alert>
		</Form>
		</div>
)
}
}

export default AddExistingTerm;