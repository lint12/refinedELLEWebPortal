import React from 'react';
import { Button, Form, FormGroup, Label, Input, Row, FormText, Col, Alert} from 'reactstrap';
import axios from 'axios';

class AddModule extends React.Component {

    //TODO: create submit function compatible with current database
    render () {
        return (
            <div>
            <Alert style={{color: '#004085', backgroundColor: 'deepskyblue'}}>
            <Form> 
                <Row>
			        <Col>
                        <FormGroup>
							
                            <Label for="moduleName">Module Name:</Label>
							<Input type="text" placeholder="Module Name"/>
						</FormGroup>
                    </Col>
                </Row>

                <Row>
			        <Col>
                        <FormGroup>

							<Label for="moduleLang">Language:</Label>
							<Input type="text" placeholder="Language"/>
						</FormGroup>
                    </Col>
                </Row>

                <Row>
			        <Col>
                        <FormGroup tag="fieldset">

                            <Label for="type">Type:</Label>

                            <FormGroup check>
                                <Label check>
                                    <Input type="radio" name="type" />{' '}
                                    Term 
                                </Label>
                            </FormGroup>

                            <FormGroup check>
                                <Label check>
                                    <Input type="radio" name="type" />{' '}
                                    Phrase
                                </Label>
                            </FormGroup>

                            <FormGroup check>
                                <Label check>
                                    <Input type="radio" name="type" />{' '}
                                    Question/Answer
                                </Label>
                            </FormGroup>

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