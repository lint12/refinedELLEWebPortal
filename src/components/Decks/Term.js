import React from 'react'
import { Button, Form, FormGroup, Label, Input, Row, FormText, Col, Alert } from 'reactstrap';
import '../../stylesheets/style.css';
import axios from 'axios';

class Term extends React.Component {
    constructor(props) {
		super(props);

		this.change = this.change.bind(this);

		this.state = {
			cardID: "",
			id: this.props.id, //refers to the deck that this card will be added to 
			front: "",
			back: "",
			tags: "", //maybe an array of strings instead?
			selectedPicFile: null,
			selectedAudioFile: null
		};
    }

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

	submitCard(e) {
        console.log("clicked on create button");
        console.log(this.state.front); 
        console.log(this.state.back);
        console.log(this.state.id);
		if ( this.state.front != null && this.state.back != null )
		{
	    	e.preventDefault();;
			const formPicData = new FormData()
			formPicData.append('file', this.state.selectedPicFile)
			const formAudioData = new FormData()
			formAudioData.append('file', this.state.selectedAudioFile)

	    	var data = {
				front: this.state.front,
				back: this.state.back,
			}
			
			// var fileheader = {
			// 	'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
			// 	'Content-Type': 'multipart/form-data'
			// }

	   		var headers = {
	        	'Authorization': 'Bearer ' + localStorage.getItem('jwt')
	   		}
               
            console.log(headers); 
			axios.post(this.props.serviceIP + '/term', data, {headers:headers})
	      	.then(res => {
	        	 console.log(res.data);
				// axios.post(this.props.serviceIP + '/card/image/' + res.data.cardID, formPicData, {headers:fileheader})
				// .then(res => {
				// 	console.log(res.data);
				// }).catch(function (error) {
				// 	console.log(error);
				// });
				// axios.post(this.props.serviceIP + '/card/sound/' + res.data.cardID, formAudioData, {headers:fileheader})
				// .then(res => {
				// 	console.log(res.data);
				// }).catch(function (error) {
				// 	console.log(error);
				// });
	      	}).catch(function (error) {
	        	console.log(error);
	      	});
		} else {
			console.log("Please fill all inputs!");
		}
    }
      
    render () {
        return (
            <div>
            <br></br>
            <Form onSubmit={e => this.submitCard(e)}>
            <Alert color='none' style={{color: '#004085', backgroundColor: 'skyblue'}}>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="front">English Word:</Label>
                            <Input type="text"
                            name="front"
                            onChange={e => this.change(e)}
                            value={this.state.front}
                            id="front"
                            placeholder="English Word" />
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
                            <Label for="tags">Tags:</Label>
                            <Input type="text"
                            name="tags"
                            onChange={e => this.change(e)}
                            value={this.state.tags}
                            id="tags"
                            placeholder="Tags" />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="picFile">Picture: </Label>
                            <Input type="file" onChange={this.picFileChangedHandler} />
                            <FormText color="muted">
                                Pick an actual Image for the card.
                            </FormText>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="audioFile">Audio File: </Label>
                            <Input type="file" onChange={this.audioFileChangedHandler} />
                            <FormText color="muted">
                                Pick an audio file for the card.
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
            </Form>
            </div>
        ) 
    }
}

export default Term