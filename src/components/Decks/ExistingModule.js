import React, { Component } from 'react'
import { Button } from 'reactstrap';

class ExistingModule extends Component {
	constructor(props){
		super(props);

		this.state = {
			linked: false 
		}
    }
    
    link = () => {
        console.log("selected class val: ", this.props.selectedClass)
        this.setState({ linked: true })
    }

	render() {
	    return (
			<tr>
                <td>{this.props.module.name}</td>
                <td>{this.props.module.language}</td>
                <td>{this.props.module.username}</td>
                <td>
                    <Button size="sm" onClick={() => this.link()} disabled={this.state.linked ? true : false}>
                        {this.state.linked ? "Linked" : "Link"}
                    </Button>
                </td>
		    </tr>
	    )
	}
}

export default ExistingModule