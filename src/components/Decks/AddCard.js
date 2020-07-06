import React from 'react';
//import { Button, Form, FormGroup, Label, Input, Row, FormText, Col, Alert } from 'reactstrap';
//import axios from 'axios';

import Term from './Term'; 
import Phrase from './Phrase';
import Question from './Question';

class AddCard extends React.Component {
	constructor(props) {
		super(props);

		//this.change = this.change.bind(this);

		this.state = {
			cardID: "",
			id: this.props.id, //refers to the deck that this card will be added to 
			type: this.props.type, 
			//front: "",
			//back: "",
			//tags: "", //maybe an array of strings instead?
			//difficulty: 1,
			//selectedPicFile: null,
			//selectedAudioFile: null
		};
	}

	updateDeckID(newID) {
		this.setState({
			id: newID,
		})
		this.tRef.updateDeckID(newID); 
	}

	render () {
		const id = this.state.id;
		const type = this.state.type;
		console.log("rendering add card");
		console.log(id); 

		if (id !== null) {
			if (type === 0) {return ( <Term ref={tRef => {this.tRef = tRef;}} id={id} serviceIP={this.props.serviceIP}></Term> )}
			else if (type === 1) {return ( <Phrase></Phrase> )}
			else if (type === 2) {return ( <Question></Question> )}
		}
	}
}

export default AddCard
