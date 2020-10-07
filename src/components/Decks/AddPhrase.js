import React from 'react'
import { Button, Form, FormGroup, Label, Input, Row, Col, Alert, CustomInput } from 'reactstrap';
import '../../stylesheets/style.css';
import axios from 'axios';

class AddPhrase extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
			phFront: "",
            phBack: "",  

            selectedImgFile: null, //file location of the picture selected
			selectedAudioFile: null, //file location of the audio selected

			imgLabel: "Pick an image for the term", 
			audioLabel: "Pick an audio for the term",
		};
    }

    submitPhrase = (event) => {
		console.log("FRONT: ", this.state.phFront)
        console.log("BACK: ", this.state.phBack)
        console.log("IMG: ", this.state.selectedImgFile)
		console.log("Audio: " ,this.state.selectedAudioFile)
		console.log("language: ", this.props.curModule.language)
		console.log("id: ", this.props.curModule.moduleID)

		if (this.state.phFront.length !== 0 && this.state.phBack.length !== 0)
		{   
			event.preventDefault();
			const data = new FormData();    
			let header = {
				headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
            };

			//required fields for adding a phrase
			data.append('front', this.state.phFront); 
			data.append('back', this.state.phBack); 
			data.append('moduleID', this.props.curModule.moduleID); 
            data.append('language', this.props.curModule.language); 
            //the type of a term must be PH in order to added as a phrase in the backend, so this will be hardcoded 
            data.append('type', "PH");  

            this.props.permissionLevel === "ta" ? data.append('groupID', this.props.currentClass.value) : data.append('groupID', null);
            
            //optional fields for adding a phrase 
			if (this.state.selectedImgFile !== null || this.state.selectedImgFile !== undefined)
				data.append('image', this.state.selectedImgFile);

			if (this.state.selectedAudioFile !== null || this.state.selectedAudioFile !== undefined)
				data.append('audio', this.state.selectedAudioFile);


			axios.post(this.props.serviceIP + '/term', data, header)
				.then(res => {
                    console.log(res.data); 
                    this.resetFields(); 
					this.props.updateCurrentModule({ module: this.props.curModule });
				}) 
				.catch(function (error) {
					console.log("submitPhrase error: ", error);
				});
		} else {
			event.preventDefault();
			alert("Please fill all inputs!");
		}
    }

    resetFields = () => {
        this.setState({
            phFront: "",
            phBack: "",  

            selectedImgFile: null, 
			selectedAudioFile: null, 

			imgLabel: "Pick an image for the term", 
			audioLabel: "Pick an audio for the term",
        })
    }

    imgFileChangedHandler = (event) => {
        this.setState({
          selectedImgFile: event.target.files[0],
          imgLabel: event.target.files[0] === undefined ? "Pick an image for the term" : event.target.files[0].name
      })
    }

    audioFileChangedHandler = (event) => {
        this.setState({
            selectedAudioFile: event.target.files[0],
            audioLabel: event.target.files[0] === undefined ? "Pick an audio for the term" : event.target.files[0].name
        })
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
            <Form onSubmit={e => this.submitPhrase(e)}>
            <Alert color='none' style={{color: '#004085', backgroundColor: 'lightskyblue', border: "none"}}>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="phFront">Phrase (English):</Label>
                            <Input type="text"
                            name="phFront"
                            onChange={e => this.change(e)}
                            value={this.state.phFront}
                            id="phFront"
                            placeholder="Phrase in English"
                            autoComplete="off" />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="phBack">Phrase (Translated):</Label>
                            <Input type="text"
                            name="phBack"
                            onChange={e => this.change(e)}
                            value={this.state.phBack}
                            id="phBack"
                            placeholder="Phrase Translated"
                            autoComplete="off" />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
				<Col>
					<FormGroup>
						<Label for="phImgFile">
							Image:
						</Label>

						<CustomInput 
                        type="file" 
                        accept=".png, .jpg, .jpeg" 
						id="phImgFile" 
						label={this.state.imgLabel} 
						onChange={this.imgFileChangedHandler}
						/>
					</FormGroup>
				</Col>
				
				<Col>
					<FormGroup>
						<Label for="phAudioFile">
							Audio:
						</Label>

						<CustomInput 
                            type="file"
                            accept=".ogg, .wav, .mp3" 
							id="phAudioFile" 
							label={this.state.audioLabel} 
							onChange={this.audioFileChangedHandler}
							/>
					</FormGroup>
				</Col>
                </Row>
                <Row>
                    <Col>
                        <Button style={{backgroundColor: '#004085', border: "none"}} type="submit" block>
                            Create
                        </Button>
                        <Button style={{backgroundColor: 'steelblue', border: "none"}} onClick={() => this.props.setOpenForm(0)} block>
                            Cancel
                        </Button>
                    </Col>
                </Row>
            </Alert>
            </Form>
            </div>
        )
    }
}

export default AddPhrase