import React, {Component} from 'react';
import {Label, Row } from 'reactstrap';

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

	componentDidMount() {
		//console.log("in componentDidMount of TagList, this.props.deleteTag: ", this.props.deleteTag, "this.props.tags: ", this.props.tags);
	}


	renderList = (tags, handleDeleteTag) => {
		let list = [];


	
		for(let i = 0; i < tags.length; i++){
			
			list.push(<TagItem tag={tags[i]} key={i} 
				handleDeleteTag={handleDeleteTag} deletable={this.props.deletable}/>);
		}
	
		/*
		list = tags.map((label, i) => {return <TagItem tag={label} key={i} 
				handleDeleteTag={handleDeleteTag} />})
		*/

		return list;
	}

	render(){


		return(
			<div>
				<Label> Tags: </Label>
				<Row>					
					{this.renderList(this.state.tags, this.props.handleDeleteTag)}
				</Row>
			</div>
		);
	}
}

export default TagList;