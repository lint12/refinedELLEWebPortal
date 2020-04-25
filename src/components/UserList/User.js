import React, { Component } from 'react'

class User extends Component {
	constructor(props){
		super(props);

		this.state = {
			users: this.props.users
		}
	}

	render() {
	    return (
				<tr>
					<td>{this.state.users.id}</td>
					<td>{this.state.users.username}</td>
		      <td>{this.state.users.permissions}</td>
		    </tr>
	    )
	}
}

export default User
