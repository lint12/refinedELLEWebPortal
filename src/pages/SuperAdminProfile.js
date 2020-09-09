import React, { Component } from 'react';
import { Container, Row, Col, Button, Card, CardBody, Form, FormGroup, FormFeedback, Input, InputGroup, InputGroupAddon,
         Label, Modal, ModalHeader, ModalFooter, Tooltip } from 'reactstrap';
import Template from './Template';
import AccessDenied from './AccessDenied'; 
import axios from 'axios';

export default class SuperAdminProfile extends Component {
    constructor() {
        super();
        this.state = {
            userID: "",
            username: "",
            newPassword: "",
            confirmPassword: "",
            validConfirm: false,
            invalidConfirm: false, 
            hiddenPassword: true,
            hiddenConfirm: true, 
            tooltipOpen: false,
            pwModal: false
        };
    }

    componentDidMount() {
        this.getUserInfo(); 
    }

    getUserInfo = () => {
        axios.get(this.props.serviceIP + '/user', 
        { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
        }).then(res => {
            console.log(res.data);
            this.setState({ 
                userID: res.data.id,
                username: res.data.username 
            });
        }).catch(error => {
            console.log(error); 
        })
    }
    
    toggleTooltipOpen = () => {
        this.setState({ tooltipOpen: !this.state.tooltipOpen })
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
                    <br/> <br/> 
                    {localStorage.getItem('per') === "su" 
                    ?           
                        <div>
                            <br/> <br/> 
                            <Row>
                                <Col sm="12" md={{ size: 6, offset: 5 }}>      
                                    <img 
                                        src={require('../Images/superAdmin.png')}
                                        alt="Icon made by Freepik from www.flaticon.com" 
                                        style={{width: "200px", height: "200px", borderStyle: "solid", borderRadius: "100px"}}
                                    />
                                </Col>   
                            </Row>
                            <br />
                            <Row>
                                <Col >
                                    <h2 style={{display: "flex", justifyContent: "center"}}>
                                        Welcome back {this.state.username}!
                                        <Button 
                                            id="changePassword"
                                            style={{backgroundColor: "aliceblue",
                                                margin: "5px 0 0 10px", padding: "0",
                                                width: "30px", height: "30px"}}
                                            onClick={() => this.togglePwModal()}>
                                            <img src={require('../Images/password.png')} style={{width: "25px", height: "25px"}}/>
                                        </Button>
                                        <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="changePassword" toggle={this.toggleTooltipOpen}>
                                            Click to Change Password
                                        </Tooltip>
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
                                    </h2>
                                </Col>
                            </Row>
                        </div>
                    :
                        <AccessDenied message={"Access Denied :("}/>
                    }
            </Container>
        );
    }
}