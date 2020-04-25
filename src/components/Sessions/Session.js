import React from 'react'
import { Card, CardText, CardBody,
  CardTitle, CardSubtitle } from 'reactstrap';

const Session = (props) => {
	const { sessions } = props;

	    return (
		      <Card>
		        <CardBody>
		          <CardTitle>Deck:{sessions.puzleAttempted}</CardTitle>
		          <CardSubtitle>Score: {sessions.playerScore}</CardSubtitle>
							<CardText>User: TempUser</CardText>
		        </CardBody>
		        <CardBody>
		          <ul>
								<li>Time Taken: {sessions.elaspsedTime}</li>
								<li>Correct Answers: {sessions.correctAns}</li>
								<li>InCorrect Answers: {sessions.wrongAns}</li>
								<li>Response Score: {sessions.responseScore}</li>
								<li>Date: {sessions.date}</li>
							</ul>
		        </CardBody>
		      </Card>
	    )
}

export default Session
