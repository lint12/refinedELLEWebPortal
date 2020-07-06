import React from 'react'
import { Table } from 'reactstrap';
import Card from './Card';
import '../../stylesheets/style.css';

const CardList = (props) => {

      //TODO: after hooked up to database, make sure it works
      //renders the header to the table of cards in a deck
      let renderHeader = () => {
        if(this.props.type == ""){
          return;
        }


        if(this.props.type == "question"){
          return(
            <thead>
              <tr>
                <th style={{width: '32%'}}>English</th>
                <th style={{width: '32%'}}>Translated</th>
                <th style={{width: '12%'}}>Picture</th>
                <th style={{width: '12%'}}>Audio</th>
                <th style={{width: '12%'}}>ID</th>
                <th style={{width: '32%'}}>Edit/Delete</th>
              </tr>
            </thead>
          );

        } else if (this.props.type == "phrase"){
          return(
            <thead>
              <tr>
                <th style={{width: '32%'}}>English</th>
                <th style={{width: '32%'}}>Translated</th>
                <th style={{width: '12%'}}>Picture</th>
                <th style={{width: '12%'}}>Audio</th>
                <th style={{width: '12%'}}>ID</th>
                <th style={{width: '32%'}}>Edit/Delete</th>
              </tr>
            </thead>
          );

        } else if (this.props.type == "term"){
          return(
            <thead>
              <tr>
                <th style={{width: '32%'}}>English</th>
                <th style={{width: '32%'}}>Translated</th>
                <th style={{width: '12%'}}>Picture</th>
                <th style={{width: '12%'}}>Audio</th>
                <th style={{width: '12%'}}>ID</th>
                <th style={{width: '32%'}}>Edit/Delete</th>
              </tr>
            </thead>
            );
        }
      };

      console.log("GOT INTO CARDLIST: ", props.cards);
	    return (
        <Table hover className="tableList">
          <thead>
            <tr>
              <th style={{width: '32%'}}>English</th>
              <th style={{width: '32%'}}>Translated</th>
              <th style={{width: '12%'}}>Picture</th>
              <th style={{width: '12%'}}>Audio</th>
							<th style={{width: '12%'}}>ID</th>
              <th style={{width: '32%'}}>Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {props.cards.map((card) => {
              return (
                <Card
                  key={card.termID}
                  card={card}/>
              )
            })}
          </tbody>
        </Table>
	    )
}

export default CardList
