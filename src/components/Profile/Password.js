import React, { Component } from 'react'
import { Button, Tooltip, Modal, ModalHeader, ModalBody, ModalFooter, 
    Form, FormGroup, Label, InputGroup, Input, InputGroupAddon, FormFeedback } from 'reactstrap';
import axios from 'axios';

export default class Password extends Component {
	constructor(props){
		super(props);

		this.state = {
            newPassword: "",
            confirmPassword: "",
            validConfirm: false,
            invalidConfirm: false, 
            hiddenPassword: true,
            hiddenConfirm: true, 

            tooltipOpen: false,
            pwModal: false, 
        }
    }

    validatePassword = (e) => {
        let id = e.target.name === "newPassword" ? 0 : 1; 
    
        this.setState({
          [e.target.name]: e.target.value
        })
    
        if (id === 0) {
          if ((e.target.value.length === 0 && this.state.confirmPassword.length === 0)|| 
            (e.target.value.length > 0 && this.state.confirmPassword.length === 0)) {
            this.setState({
              validConfirm: false, 
              invalidConfirm: false
            })
          }
          else if (e.target.value.localeCompare(this.state.confirmPassword) === 0) {
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
          if ((e.target.value.length === 0 && this.state.newPassword.length === 0)) {
            this.setState({
              validConfirm: false, 
              invalidConfirm: false
            })
          }
          else if (e.target.value.localeCompare(this.state.newPassword) === 0) {
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

    submitPassword = () => {
        var data = {
          userID: this.state.userID,
          pw: this.state.newPassword,
          confirm: this.state.confirmPassword
        }
        var headers = {
          'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        }
  
        axios.post(this.props.serviceIP + '/resetpassword', data, {headers:headers})
        .then(res => {
          console.log(res.data);
          this.togglePwModal(); 
        }).catch(function (error) {
          console.log(error);
        });
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

    togglePwModal = () => {
        this.setState({
          pwModal: !this.state.pwModal, 
          newPassword: "", 
          confirmPassword: "", 
          validConfirm: false, 
          invalidConfirm: false, 
        })
    }
  

	render() { 
        return (
            <>
                {this.props.userType === "su" 
                ?
                    <p className="setting" onClick={() => this.togglePwModal()}> settings </p> 
                :
                    <>
                        <Button id="changePassword" style={{backgroundColor: "aliceblue", float: "right", border: "none", borderRadius: "0 3px 3px 0"}}
                            onClick={() => this.togglePwModal()}> 
                            <img src={require('../../Images/password.png')} style={{width: "15px", height: "15px"}}/>
                        </Button>
                        <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="changePassword" toggle={this.toggleTooltipOpen}>
                            Click to Change Password
                        </Tooltip>
                    </>
                }

                <Modal isOpen={this.state.pwModal} toggle={this.togglePwModal}>
                    <ModalHeader toggle={this.togglePwModal}>Change Password</ModalHeader>
                        <ModalBody>
                            <Form>
                                <FormGroup>
                                <Label>New Password:</Label>
                                <InputGroup>
                                <Input 
                                    type={this.state.hiddenPassword ? 'password' : 'text'}
                                    name="newPassword"
                                    id="newPassword"
                                    placeholder="Enter your new password here."
                                    autoComplete="new-password"
                                    onChange={e => this.validatePassword(e)}
                                    value={this.state.newPassword}
                                />
                                <InputGroupAddon addonType="append">
                                    <Button 
                                        style={{backgroundColor: "white", border: "none"}} 
                                        name="hiddenPassword"
                                        onClick={e => this.togglePWPrivacy(e)}
                                    >
                                        {this.state.hiddenPassword ?
                                            <img 
                                                src={require('../../Images/hide.png')} 
                                                alt="Icon made by Pixel perfect from www.flaticon.com" 
                                                name="hiddenPassword"
                                                style={{width: '24px', height: '24px'}}
                                            />
                                            :
                                            <img 
                                                src={require('../../Images/show.png')} 
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
                                    <InputGroup>
                                        <Input 
                                            valid={this.state.validConfirm}
                                            invalid={this.state.invalidConfirm}
                                            type={this.state.hiddenConfirm ? 'password' : 'text'}
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            placeholder="Confirm your new password here."
                                            autoComplete="off"
                                            onChange={e => this.validatePassword(e)}
                                            value={this.state.confirmPassword}
                                        />
                                        <InputGroupAddon addonType="append">
                                            <Button 
                                                style={{backgroundColor: "white", border: "none"}} 
                                                name="hiddenConfirm"
                                                onClick={e => this.togglePWPrivacy(e)}
                                            >
                                                {this.state.hiddenConfirm ?
                                                    <img 
                                                        src={require('../../Images/hide.png')} 
                                                        alt="Icon made by Pixel perfect from www.flaticon.com" 
                                                        name="hiddenConfirm"
                                                        style={{width: '24px', height: '24px'}}
                                                    />
                                                    :
                                                    <img 
                                                        src={require('../../Images/show.png')} 
                                                        alt="Icon made by Kiranshastry from www.flaticon.com" 
                                                        name="hiddenConfirm"
                                                        style={{width: '24px', height: '24px'}}
                                                    />
                                                }
                                            </Button>
                                        </InputGroupAddon>
                                        <FormFeedback valid className="feedback">
                                            The passwords match!
                                        </FormFeedback>
                                        <FormFeedback invalid={this.state.invalidConfirm.toString()} className="feedback">
                                            The passwords do not match, please try again.
                                        </FormFeedback>
                                    </InputGroup>
                                </FormGroup>
                            </Form>
                    </ModalBody>
                    <ModalFooter>
                    <Button disabled={this.state.validConfirm ? false : true} block onClick={() => this.submitPassword()}>
                        Submit New Password
                    </Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}