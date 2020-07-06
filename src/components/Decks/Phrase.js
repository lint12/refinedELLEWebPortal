import React from 'react'
import { Button, Form, FormGroup, Label, Input, Row, FormText, Col, Alert } from 'reactstrap';
import '../../stylesheets/style.css';
import axios from 'axios';

class Phrase extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
			cardID: "",
			id: this.props.id, //refers to the deck that this card will be added to 
			front: "",
            back: "",
            selectedAudioFile: null
		};
    }

    handleSubmit = event => {
        event.preventDefault(); 

        // const phrase = {
        //     front: this.state.front,
        //     back: this.state.back
        // }

        axios.post()
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
            <Alert color='none' style={{color: '#004085', backgroundColor: 'burlywood'}}>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="front">Phrase (English):</Label>
                            <Input type="text"
                            name="front"
                            onChange={e => this.change(e)}
                            value={this.state.front}
                            id="front"
                            placeholder="Phrase in English" />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="back">Phrase (Translated):</Label>
                            <Input type="text"
                            name="back"
                            onChange={e => this.change(e)}
                            value={this.state.back}
                            id="back"
                            placeholder="Phrase Translated" />
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

export default Phrase