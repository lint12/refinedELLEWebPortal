import React, {Component} from 'react';
import {Label, Row, Col} from 'reactstrap';

import TermItem from './TermItem';

class TermList extends Component {
	constructor(props){
		super(props);

		this.renderList = this.renderList.bind(this);
		//this.renderTagTriple = this.renderTagTriple.bind(this);

		this.state = {
			terms: this.props.terms
		};
	}


	renderList = (terms) => {
		let list = [];

		for(let i = 0; i < terms.length; i++){			
			list.push(<TermItem tag={terms[i]} />);
		}

		console.log("Done with renderList, list: ", list);
		return list;
	}

	render(){
		return(
			<div>
				<Label> Terms: </Label>
				<Row>
					{this.renderList(this.state.terms)} 
				</Row>
			</div>
		);
	}
}

export default TermList;