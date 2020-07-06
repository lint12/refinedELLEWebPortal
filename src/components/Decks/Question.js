import React from 'react'
import { Button, Form, FormGroup, Label, Input, Row, FormText, Col, Alert } from 'reactstrap';
import '../../stylesheets/style.css';
//import axios from 'axios';

class Question extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
			cardID: "",
			id: this.props.id, //refers to the deck that this card will be added to 
			questionText: "",
            answer: "",
            selectedPicFile: null,
            selectedAudioFile: null
		};
    }

    change(e) {
        this.setState({
          [e.target.name]: e.target.value
        })
    }

    render () {
        return (
            <div>
            <br></br>
            <Form onSubmit={e => this.submitCard(e)}>
            <Alert color='none' style={{color: '#004085', backgroundColor: 'lightpink'}}>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="questionText">Question:</Label>
                            <Input type="text"
                            name="questionText"
                            onChange={e => this.change(e)}
                            value={this.state.questionText}
                            id="questionText"
                            placeholder="Type your ? here" />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="answer">Answer(s):</Label>
                            <Input type="text"
                            name="answer"
                            onChange={e => this.change(e)}
                            value={this.state.answer}
                            id="answer"
                            placeholder="Type your answer(s) here" />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <FormGroup>
                            <Label for="picFile">Picture: </Label>
                            <Input type="file" onChange={this.picFileChangedHandler} />
                            <FormText color="muted">
                                Pick an actual Image for the card.
                            </FormText>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="audioFile">Audio File: </Label>
                            <Input type="file" onChange={this.audioFileChangedHandler} />
                            <FormText color="muted">
                                Pick an audio file for the card.
                            </FormText>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button style={{backgroundColor: '#004085'}} type="submit" block>Create</Button>
                    </Col>
                </Row>
            </Alert>
            </Form>
            </div>
        )
    }
}

export default Question