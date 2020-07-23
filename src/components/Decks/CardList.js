import React, { useState } from 'react'
import { Table } from 'reactstrap';
import Card from './Card';
import Phrase from './Phrase';

import Question from './Question';
import axios from 'axios';

import '../../stylesheets/style.css';

const CardList = (props) => {

    const removeDuplicates = () => {
      let idList = []; 
      let filteredList = []; 

      props.cards.map((card) => 
      {
          if (idList.indexOf(card.termID) === -1) {
            idList.push(card.termID); 
            filteredList.push(card);
          }
      })
      return filteredList; 
    }

    let list = removeDuplicates(); 

    if (props.type === 0) {
	    return (
        <Table hover className="tableList">
          <thead>
            <tr>
              <th style={{width: '32%'}}>English</th>
              <th style={{width: '32%'}}>Translated</th>
              <th style={{width: '12%'}}>Type</th>
              <th style={{width: '12%'}}>Gender</th>
              <th style={{width: '12%'}}>Picture</th>
              <th style={{width: '12%'}}>Audio</th>
							<th style={{width: '12%'}}>ID</th>
              <th style={{width: '32%'}}> </th> 
            </tr>
          </thead>
          <tbody>
            {list.map((card) => {
              return (
                <Card
                key={card.termID}
                card={card}
                serviceIP={props.serviceIP}
                curModule={props.curModule}
                updateCurrentModule={props.updateCurrentModule}
                deleteTag={props.deleteTag}
                addTag={props.addTag}
                allTags={props.allTags}/>
              )
            })}
          </tbody>
        </Table>
      )
    }
    else if(props.type === 1) {
      return (
        <Table hover className="tableList">

          <thead>
            <tr>
              <th style={{width: '32%'}}>Phrase (English)</th>
              <th style={{width: '32%'}}>Phrase (Translated)</th>
              <th style={{width: '12%'}}>Picture</th>
              <th style={{width: '12%'}}>Audio</th>
              <th style={{width: '12%'}}>ID</th>
              <th style={{width: '32%'}}> </th> 
            </tr>
          </thead>
          <tbody>
            {list.map((card) => {
              return (
                <Phrase                   
                  key={card.termID}
                  card={card}
                  serviceIP={props.serviceIP}
                  curModule={props.curModule}
                  updateCurrentModule={props.updateCurrentModule}/>
              )
            })}
          </tbody>
        </Table>
      )
    }
    else if(props.type === 2) {
      return (
        <Table hover className="tableList">
          <thead>
            <tr>
              <th style={{width: '64%'}}>Question</th>
              <th style={{width: '9%'}}>Picture</th>
              <th style={{width: '9%'}}>Audio</th>
              <th style={{width: '9%'}}>ID</th>
              <th style={{width: '9%'}}> </th>
            </tr>
          </thead>
          <tbody>
            {props.cards.map((card) => {
              return(
                <Question
                  key={card.questionID}
                  question={card}
                  serviceIP={props.serviceIP}
                  curModule={props.curModule}
                  updateCurrentModule={props.updateCurrentModule}
                  />
              )
            })}
          </tbody>

        </Table>
      )
    }
}

export default CardList
