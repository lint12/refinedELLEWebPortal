import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Label, InputGroup, InputGroupAddon, FormFeedback } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MainTemplate from '../pages/MainTemplate';
import '../stylesheets/loginstyle.css';

export default class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      token: "", 
      password: "",
      confirm: "",
      validConfirm: false,
      invalidConfirm: false,
      hiddenPassword: true,
      hiddenConfirm: true, 
    };

  }

  change(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  validatePassword = (e) => {
    let id = e.target.name === "password" ? 0 : 1; 

    this.setState({
      [e.target.name]: e.target.value
    })

    if (id === 0) {
      if ((e.target.value.length === 0 && this.state.confirm.length === 0)|| 
        (e.target.value.length > 0 && this.state.confirm.length === 0)) {
        this.setState({
          validConfirm: false, 
          invalidConfirm: false
        })
      }
      else if (e.target.value.localeCompare(this.state.confirm) === 0) {
        this.setState({
          validConfirm: true, 
          invalidConfirm: false
        })
      }
      else {
        this.setState({
          validConfirm: false, 
          invalidConfirm: true
        })
      }
    }
    else {
      if ((e.target.value.length === 0 && this.state.password.length === 0)) {
        this.setState({
          validConfirm: false, 
          invalidConfirm: false
        })
      }
      else if (e.target.value.localeCompare(this.state.password) === 0) {
        this.setState({
          validConfirm: true, 
          invalidConfirm: false
        })
      }
      else {
        this.setState({
          validConfirm: false, 
          invalidConfirm: true
        })
      }
    }
  }

  togglePWPrivacy = (e) => {
    console.log(e.target)
    if (e.target.name === "hiddenPassword") {
      this.setState({
        hiddenPassword: !this.state.hiddenPassword
      })
    }
    else {
      this.setState({
        hiddenConfirm: !this.state.hiddenConfirm
      })
    }
  }

  render() {
    return (
        <div className="reset-bg">
        <MainTemplate/>

        <div>
          <div className="reset-box">
            <h4 style={{display: "flex", justifyContent: "center"}}>Reset Your Password</h4>
            <Form style={{marginBottom: "10px"}}>
              <FormGroup>
                <Label>Email:</Label>
                <InputGroup style={{borderRadius: "12px"}}>
                <Input 
                  placeholder="user@email.com"
                  name="email"
                />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>ResetToken:</Label>
                <InputGroup style={{borderRadius: "12px"}}>
                <Input 
                  placeholder="token"
                  name="token"
                />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Password:</Label>
                <InputGroup style={{borderRadius: "12px"}}>
                  <Input 
                    value={this.state.password}
                    onChange={e => this.validatePassword(e)}
                    type={this.state.hiddenPassword ? 'password' : 'text'}
                    name="password"
                    placeholder="*********"
                    autoComplete="new-password"
                    style={{border: "none"}} 
                  />
                  <InputGroupAddon addonType="append">
                    <Button 
                      style={{backgroundColor: "white", border: "none"}}
                      name="hiddenPassword"
                      onClick={e => this.togglePWPrivacy(e)}
                    >
                    {this.state.hiddenPassword ?
                      <img 
                        src={require('../Images/hide.png')} 
                        alt="Icon made by Pixel perfect from www.flaticon.com" 
                        name="hiddenPassword"
                        style={{width: '24px', height: '24px'}}
                      />
                    :
                      <img 
                        src={require('../Images/show.png')} 
                        alt="Icon made by Kiranshastry from www.flaticon.com" 
                        name="hiddenPassword"
                        style={{width: '24px', height: '24px'}}
                      />
                    }
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Confirm Password:</Label>
                <InputGroup style={{borderRadius: "12px"}}>
                  <Input 
                    value={this.state.confirm}
                    valid={this.state.validConfirm}
                    invalid={this.state.invalidConfirm}
                    onChange={e => this.validatePassword(e)}
                    type={this.state.hiddenConfirm ? 'password' : 'text'}
                    name="confirm"
                    placeholder="*********" 
                    autoComplete="new-password"
                    style={{border: "none"}} 
                  />
                  <InputGroupAddon addonType="append">
                    <Button 
                      style={{backgroundColor: "white", border: "none", borderRadius: "0 5px 5px 0"}} 
                      name="hiddenConfirm"
                      onClick={e => this.togglePWPrivacy(e)}
                    >
                    {this.state.hiddenConfirm ? 
                      <img 
                        src={require('../Images/hide.png')} 
                        alt="Icon made by Pixel perfect from www.flaticon.com" 
                        name="hiddenConfirm"
                        style={{width: '24px', height: '24px'}}
                      />
                    :
                      <img 
                        src={require('../Images/show.png')} 
                        alt="Icon made by Kiranshastry from www.flaticon.com" 
                        name="hiddenConfirm"
                        style={{width: '24px', height: '24px'}}
                      />
                    }
                    </Button>
                  </InputGroupAddon>
                  <FormFeedback valid>
                    The passwords match!
                  </FormFeedback>
                  <FormFeedback invalid={this.state.invalidConfirm.toString()}>
                    The passwords do not match, please try again.
                  </FormFeedback>
                </InputGroup>
              </FormGroup>
              <Button block disabled={this.state.validConfirm ? false : true}>Reset</Button>
            </Form>
          </div>
        </div>

        </div>
    );
  }
}