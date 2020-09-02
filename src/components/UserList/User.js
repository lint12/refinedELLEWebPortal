import React, { Component } from 'react'

class User extends Component {
	constructor(props){
		super(props);

		this.state = {
			user: this.props.user
		}
	}

	render() {
	    return (
			<tr>
				<td>{this.state.user.userID}</td>
				<td>{this.state.user.username}</td>
				<td>{this.state.user.permissionGroup}</td>
		    </tr>
	    )
	}
}

export default User
