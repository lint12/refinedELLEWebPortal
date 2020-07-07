import React, {Component} from 'react';
import {Label, Row, Col} from 'reactstrap';

import TagItem from './TagItem';

class TagList extends Component {
	constructor(props){
		super(props);

		this.renderList = this.renderList.bind(this);
		//this.renderTagTriple = this.renderTagTriple.bind(this);

		this.state = {
			tags: this.props.tags
		};
	}


	renderList = (tags) => {
		let list = [];



		for(let i = 0; i < tags.length; i++){
			
			list.push(<TagItem tag={tags[i]} />);
		}

		console.log("Done with renderList, list: ", list);
		return list;
	}
	render(){
		return(
			<div>
				<Label> Tags: </Label>
				<Row>					
					{this.renderList(this.state.tags)} 
				</Row>
			</div>
		);
	}
}

export default TagList;