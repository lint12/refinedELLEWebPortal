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
				<td>{this.props.type === "su" ? this.state.user.permissionGroup : this.state.user.accessLevel}</td>
		    </tr>
	    )
	}
}

export default User
