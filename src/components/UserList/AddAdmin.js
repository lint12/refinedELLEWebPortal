import React, { Component } from 'react'
import { Container, Row, Col, Table, Form, Label, Input, Button } from 'reactstrap';

class User extends Component {
	constructor(props){
		super(props);

		this.state = {
			users: this.props.users
		}
	}

	render() {
	    return (
        <Row>
          <Col>
            <Form onSubmit={e => this.submit(e)}>
              <Label for="cardID">User ID:</Label>
              <Input type="text" name="cardID"
              onChange={e => this.change(e)}
              value={this.state.userID}
              id="userID" placeholder="User ID" />
              <Button color="primary" type="submit">Add Admin</Button>
            </Form>
          </Col>
        </Row>
	    )
	}
}

export default User
