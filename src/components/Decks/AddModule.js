import React from 'react';
import { Button, Form, FormGroup, Label, Input, Row, Col, Alert} from 'reactstrap';
import axios from 'axios';

class AddModule extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        name: "",
        language: ""
      }; 

      this.submitModule = this.submitModule.bind(this); 
      this.updateName = this.updateName.bind(this); 
      this.updateLanguage = this.updateLanguage.bind(this); 
}

  submitModule = (e) => {
    e.preventDefault();
    console.log("submit button has been pressed"); 
    console.log(this.props.serviceIP); 

    var data = {
        name: this.state.name,
        language: this.state.language, 
        complexity: 2
    }

    console.log("MODULE CREATION DATA: ", data); 

    axios.post(this.props.serviceIP + '/module', data, 
        {headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }).then(res => {
      console.log(res.data);
      //clears out the input fields once post has succeeded 
      this.setState({
        name: "",
        language: ""
      }); 
      this.props.updateModuleList();
    }).catch(function (error) {
      console.log(error);
    });
  }

  updateName = (e) => {
      this.setState({name: e.target.value}); 
  } 

  updateLanguage = (e) => {
    this.setState({language: e.target.value}); 
  } 

    render () {
        return (
            <div>
            <Alert color="none" style={{color: '#004085', backgroundColor: 'aliceblue'}}>
            <Form onSubmit={this.submitModule}> 
                <Row>
			        <Col>
                        <FormGroup>
							<Label for="moduleName">Module Name:</Label>
							<Input type="text" placeholder="Module Name" 
                            value={this.state.name} onChange={this.updateName}/>
						</FormGroup>
                    </Col>
                </Row>
                <Row>
			        <Col>
                        <FormGroup>
							<Label for="moduleLang">Language:</Label>
							<Input type="text" placeholder="Language"
                            value={this.state.language} onChange={this.updateLanguage}/>
						</FormGroup>
                    </Col>
                </Row>
                <Row>
					<Col>
						<Button style={{backgroundColor: '#004085'}} type="submit" block>Create</Button>
					</Col>
				</Row>
            </Form>
            </Alert> 
            </div>
        )
    }
}

export default AddModule