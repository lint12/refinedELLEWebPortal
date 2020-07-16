import React from 'react'
import { Table } from 'reactstrap';
import Card from './Card';
import '../../stylesheets/style.css';

const CardList = (props) => {
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
            {props.cards.map((card) => {
              return (
                <Card
                  key={card.termID}
                  card={card}
                  serviceIP={props.serviceIP}
                  curModule={props.curModule}
                  updateCurrentModule={props.updateCurrentModule}
                  deleteTag={props.deleteTag}/>
              )
            })}
          </tbody>
        </Table>
	    )
}

export default CardList
