import React from 'react'
import { Table } from 'reactstrap';
import Answers from './Answers';

const Rounds = (props) => {
	    return (
        <Table hover>
          <thead>
            <tr>
              <th>#</th>
              <th>English</th>
              <th>Translated</th>
              <th>English Image</th>
              <th>Translated Image</th>
              <th>Picture</th>
              <th>Audio</th>
            </tr>
          </thead>
          <tbody>
            {props.cards.map((cards) => {
              return (
                <Answers
                  key={cards.engName}
                  cards={cards}/>
              )
            })}
          </tbody>
        </Table>
	    )
}

export default Rounds
