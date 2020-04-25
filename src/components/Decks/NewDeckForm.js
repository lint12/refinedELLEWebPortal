import React, { Component } from 'react';
import { Collapse, Button, Card, Form, FormGroup, Label, Input, Container, Row, FormText, Col } from 'reactstrap';

const NewDeckForm = (props) => {
	    return (
        <Form>
          <FormGroup>
            <Label for="deckname" hidden>Deck Name</Label>
            <Input type="deckname" name="deckname" id="deckname" placeholder="Deck Name" />
          </FormGroup>
          <FormGroup>
            <Label for="author" hidden>Author</Label>
            <Input type="author" name="author" id="author" placeholder={this.props.author} />
          </FormGroup>
          <Button color="primary" block>Add Deck</Button>
        </Form>
	    )
}

export default NewDeckForm
