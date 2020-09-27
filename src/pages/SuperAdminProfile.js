import React, { Component } from 'react';
import { Container, Row, Col, Button, Card, CardBody, Form, FormGroup, FormFeedback, Input, InputGroup, InputGroupAddon,
         Label, Modal, ModalHeader, ModalFooter, Tooltip } from 'reactstrap';
import Template from './Template';
import axios from 'axios';
import '../stylesheets/superadmin.css'
import PlatformStats from '../components/Stats/PlatformStats';
import ModuleStats from '../components/Stats/ModuleStats';
import TagStats from '../components/Stats/TagStats';

export default class SuperAdminProfile extends Component {
    constructor() {
        super();
        this.state = {
            newPassword: "",
            confirmPassword: "",
            validConfirm: false,
            invalidConfirm: false, 
            hiddenPassword: true,
            hiddenConfirm: true, 
            pwModal: false
        };
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
            userID: localStorage.getItem('id'),
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

    togglePwModal = () => {
        this.setState({
            pwModal: !this.state.pwModal, 
            newPassword: "", 
            confirmPassword: "", 
            validConfirm: false, 
            invalidConfirm: false
        })
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
            <Container>
                <Template/>         
                    <div>
                        <br/> <br/> 
                        <div class="suContainer">
                            <Row>
                                <Col className="Left Column" xs="3">
                                    <Row>
                                        <Col>
                                            <div class="greetingsTag">
                                                    Welcome back {this.props.username}!
                                                    <p class="setting" onClick={() => this.togglePwModal()}> settings </p>
                                            </div>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <TagStats serviceIP={this.props.serviceIP}/>
                                    </Row>
                                </Col>
                            
                                <Col className="Right Column">
                                    <Row className="Top Row">
                                        <PlatformStats serviceIP={this.props.serviceIP}/>
                                    </Row>
                                    <br />
                                    <Row className="Bottom Row">
                                        <ModuleStats serviceIP={this.props.serviceIP}/>
                                    </Row>
                                </Col>
                            </Row>
                        </div>

                        <Modal isOpen={this.state.pwModal} toggle={this.togglePwModal}>
                            <ModalHeader toggle={this.togglePwModal}>Change Password</ModalHeader>
                                <Card style={{borderRadius: "0px"}}>
                                    <CardBody>
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
                                                <img 
                                                    src={require('../Images/hide.png')} 
                                                    alt="Icon made by Pixel perfect from www.flaticon.com" 
                                                    name="hiddenPassword"
                                                    style={{width: '24px', height: '24px'}}
                                                />
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
                                                    <img 
                                                    src={require('../Images/hide.png')} 
                                                    alt="Icon made by Pixel perfect from www.flaticon.com" 
                                                    name="hiddenConfirm"
                                                    style={{width: '24px', height: '24px'}}
                                                    />
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
                                        </Form>
                                    </CardBody>
                                </Card>
                            <ModalFooter>
                                <Button disabled={this.state.validConfirm ? false : true} 
                                        block onClick={() => this.submitPassword()}>
                                    Submit New Password
                                </Button>
                            </ModalFooter>
                        </Modal>
                    </div>
            </Container>
        );
    }
}