import React, { Component } from 'react'
import { Row, Col, Badge, Button, Card, CardBody, ListGroup, ListGroupItem,
    Form, FormGroup, Label, Input } from 'reactstrap';
import {Tabs, Tab} from 'react-bootstrap';
import axios from 'axios';
import Password from './Password';

export default class StudentView extends Component {
	constructor(props){
		super(props);

		this.state = {
            classes: [],
            classCode: ""
        }
 
    }

    componentDidMount() {
        this.getClasses(); 
    }

    change(e) {
        this.setState({
          [e.target.name]: e.target.value
        })
    }

    getClasses = () => {
        axios.get(this.props.serviceIP + '/searchusergroups', {
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
        }).then(res => {
          console.log(res.data); 
          this.setState({ classes: res.data })
        }).catch(error => {
          console.log(error.response); 
        })
    }

    submitClassCode = (e) => {
        e.preventDefault(); 
        console.log("CODE: ", this.state.classCode); 
        var data = {
          groupCode: this.state.classCode
        }
    
        var headers = {
          'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        }
    
        axios.post(this.props.serviceIP + '/groupregister', data, {headers:headers}
        ).then(res => {
          console.log(res.data); 
          this.getClasses(); 
          this.setState({ classCode: "" }); 
        }).catch(error => {
          console.log(error.response); 
        })
    }

	render() { 
        return (
            <>
                <h3><Badge style={{backgroundColor: "cadetblue"}}>Your Profile</Badge></h3> 
                <Row>
                    <Col xs="3">
                    <Card style={{backgroundColor: "lightblue", height: "65vh"}}>
                    <CardBody>
                    <h6>Username:</h6>
                    <Card>
                        <Row>
                            <Col xs="9" style={{paddingLeft: "35px", paddingTop: "5px"}}>
                                {this.props.username}
                            </Col>
                            <Col xs="3">
                                <Password serviceIP={this.props.serviceIP} userType="st" email={this.props.email} editEmail={this.props.editEmail}/>
                            </Col>
                        </Row>
                    </Card>

                    <br />
                    
                    <h6>Classes:</h6>
                    <Card style={{overflow:"scroll", height: "20vh"}}>
                        <ListGroup flush>
                        {this.state.classes.length === 0 
                        ? <ListGroupItem> You currently are not part of any classes. </ListGroupItem>
                        : this.state.classes.map((item, i) => {
                            return(
                                <ListGroupItem key={i}> 
                                    {item.groupName} 
                                </ListGroupItem>
                            )})
                        }
                        </ListGroup>
                    </Card>

                    <Form onSubmit={e => this.submitClassCode(e)}>
                        <h4 style={{marginTop: "8px"}}>Join a New Class</h4>
                        <FormGroup>
                            <Label for="classCode">Class Code: </Label>
                            <Input 
                                type="text"
                                name="classCode"
                                id="classCode"
                                onChange={e => this.change(e)}
                                value={this.state.classCode} 
                            />
                        </FormGroup>
                        <Button block type="submit">Join</Button>
                    </Form>

                    </CardBody>
                    </Card>
                    </Col>

                    <Col xs="9">
                    <Card style={{backgroundColor: "cadetblue", height: "65vh"}}>
                        <CardBody style={{color: "#04354b"}}>
                            <h1>
                                Welcome back {this.props.username}!
                            </h1>
                        </CardBody>
                    </Card>
                    </Col>
                </Row>
            </>
        );
    }
}