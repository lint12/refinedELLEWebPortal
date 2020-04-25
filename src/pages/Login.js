import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Container, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MainTemplate from '../pages/MainTemplate';

import '../stylesheets/loginstyle.css';
import '../stylesheets/style.css';
import '../lib/bootstrap/css/bootstrap.min.css';
import '../lib/ionicons/css/ionicons.min.css';

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
    };
    this.change = this.change.bind(this);
    this.submit = this.submit.bind(this);
  }

  change(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  submit(e) {
    e.preventDefault();
    axios.post(this.props.serviceIP + '/login', {
      username: this.state.username,
      password: this.state.password
    }).then(res => {
      console.log(res.data);
      console.log(res.data.access_token);
      console.log(res.data.permissions);
      localStorage.setItem('jwt', res.data.access_token);
      localStorage.setItem('per', res.data.permissions);
      this.props.history.push('/decks');
    });
  }

  render() {
    return (
    <Container>
      <MainTemplate/>

      <div className="row main" >
        <div className="main-login main-center">
          <h4 style={{textAlign: 'center'}}>Welcome back to ELLE.</h4>
          <Form onSubmit={e => this.submit(e)}>
            <FormGroup>
              <Label for="userName">Username:</Label>
              <Input type="username" name="username"
                onChange={e => this.change(e)}
                value={this.state.username}
                id="username" placeholder="Username" />
            </FormGroup>
            {' '}
            <FormGroup>
              <Label for="password">Password:</Label>
              <Input type="password" name="password"
                onChange={e => this.change(e)}
                value={this.state.password}
                id="password" placeholder="Password" />
            </FormGroup>
            {' '}
            <Button color="primary" type="submit" className="btn-block">Submit</Button>
          </Form>
          <br></br>
					<p>
						Don't have an account? &nbsp;
						<Link to ='/signup' style={{color: 'white', textDecoration: 'underline'}}>Create one.</Link>
					</p>
        </div>
      </div>
    </Container>
    );
  }
}
