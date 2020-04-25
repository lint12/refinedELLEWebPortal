import React, { Component } from 'react'

export default class GroupUsers extends Component {

	constructor(props) {
		super(props)
		this.submit = this.submit.bind(this)
	}

	submit(e) {
		e.preventDefault()

	}

	render() {

		return (
			<form onSubmit={this.submit} className="add-day-form">

				<button>Add Users</button>
			</form>
		)
	}
}
