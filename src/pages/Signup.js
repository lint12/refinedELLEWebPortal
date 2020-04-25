import React from 'react';
import { Form, FormGroup, Label, Input, FormFeedback, Button, Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MainTemplate from '../pages/MainTemplate';

import '../stylesheets/loginstyle.css';
import '../stylesheets/style.css';
import '../lib/bootstrap/css/bootstrap.min.css';
import '../lib/ionicons/css/ionicons.min.css';

export default class Signup extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      age: '',
      sex: '',
      password: '',
      motivation: '',
      permission: 'User',
      message: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.change = this.change.bind(this);
    this.submit = this.submit.bind(this);
  };

  handleChange(event) {
    this.setState({
      sex: event.target.value,
    })
  }

  change(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  submit(e) {
    console.log(this.state.username);
    console.log(this.state.sex);
    e.preventDefault();
    axios.post(this.props.serviceIP + '/register', {
      username: this.state.username,
      password: this.state.password,
      age: this.state.age,
      sex: this.state.sex,
      motivation: this.state.motivation
    }).then(res => {
      localStorage.setItem('jwt', res.data);
      this.props.history.push('/login');
    });
  }

  render() {
  return (
  <Container>
    <MainTemplate/>
		
		<div className="row main">
      <div className="main-login main-center">
        <h4 style={{textAlign: 'center'}}>Start your ELLE experience today.</h4>
        <Form onSubmit={e => this.submit(e)}>
          <FormGroup>
            <Label for="userName">Username:</Label>
            <Input value={this.state.username}
              onChange={e => this.change(e)}
              id="username"
              name="username"
              placeholder="Username"
            />
            <FormFeedback>You will not be able to see this</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="age">Age:</Label>
            <Input value={this.state.age}
              onChange={e => this.change(e)}
              id="age"
              name="age"
              placeholder="18">
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="sex">Sex:</Label>
            <Input value={this.state.sex}
              onChange={(e) => this.handleChange(e)}
              type="select"
              id="sex"
              name="sex">
              <option value="F">Male</option>
              <option value="M">Female</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="motivation">Motivation:</Label>
            <Input value={this.state.motivation}
              onChange={e => this.change(e)}
              type="textarea"
              name="motivation"
              id="motivation"
              placeholder="Why are you playing ELLE?">
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="password">Password:</Label>
            <Input value={this.state.password}
              onChange={e => this.change(e)}
              type="text"
              id="password"
              name="password"
              placeholder="*********">
            </Input>
          </FormGroup>
          <Button color="primary" type="submit" className="btn-block">Signup</Button>
        </Form>
        <br></br>
        <p>
          Already have an account? &nbsp;
          <Link to ='/Login' style={{color: 'white', textDecoration: 'underline'}}>Log in.</Link>
        </p>
      </div>
    </div>
  </Container>
  );
  }
}
