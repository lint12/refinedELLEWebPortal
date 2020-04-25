import React from 'react';
import { Button, Form, FormGroup, Label, Input, Container } from 'reactstrap';
import axios from 'axios';
import Template from './Template';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        userID: '',
        users: [],
        username: "temp",
        permissionGroup: "Admin",
        isPendingAdmin: "1",
        //sex: "M",
        age: "18",
        motivation: "Test",
        newpass: "",
        repass: ""
    };

    this.change = this.change.bind(this);
    this.submitPass= this.submitPass.bind(this);
  }

  change(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

submitPass(e) {
    e.preventDefault();
    var data = {
          userID: this.state.userID,
          pw: this.state.newpass,
    }
    var headers = {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    }
        axios.post(this.props.serviceIP + '/users/reset', data, {headers:headers})
        .then(res => {
          console.log(res.data);
        }).catch(function (error) {
          console.log(error);
        });
  }

  componentDidMount() {
      axios.get(this.props.serviceIP + '/user', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
      }).then(res => {
          console.log(res.data);
          this.setState({
            userID: res.data.id,
            username: res.data.username,
            sex: res.data.sex,
            age: res.data.age,
            motivation: res.data.motivation, });
        }).catch(function (error) {
          console.log(error);
        });
    }


  render() {
    return (
      <Container>
      <Template/>
		<br></br><br></br>
	  
      <h3>Your Profile</h3>
        <Form className="ProfileForm">
          <FormGroup>
            <Label for="username">Username</Label>
            <Input type="text"
            name="username"
            id="username"
            disabled
            value={this.state.username} />
          </FormGroup>
          <FormGroup>
            <Label for="age">Age</Label>
            <Input type="number"
            name="age"
            id="age"
            disabled
            value={this.state.age} />
          </FormGroup>
          <FormGroup>
            <Label for="sex">Sex</Label>
            <Input type="text"
            name="sex"
            id="sex"
            disabled
            value={this.state.sex} />
          </FormGroup>
          <FormGroup>
            <Label for="motivation">Motivation:</Label>
            <Input type="textarea"
            name="motivation"
            id="motivation"
            disabled
            value={this.state.motivation} />
          </FormGroup>
        </Form>
        <Form className="PasswordReset" onSubmit={e => this.submitPass(e)}>
        <h3>Reset Password</h3>
          <FormGroup>
            <Label for="newpass">Enter your new password below.</Label>
            <Input type="text"
            name="newpass"
            id="newpass"
            onChange={e => this.change(e)}
            value={this.state.newpass} />
          </FormGroup>
          <Button type="submit">Submit New Password</Button>
		  
        </Form>
		<br/>
      </Container>
    );
  }
}
