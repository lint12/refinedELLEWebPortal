import React from 'react';
import { Table } from 'reactstrap';
import Group from './Group';

const GroupDecks = (props) => {
    return (
      <Table hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Group Name</th>
          </tr>
        </thead>
        <tbody>
          {props.groups.map((groups) => {
            return (
              <Group
                key={groups.name}
                groups={groups}/>
            )
          })}
        </tbody>
      </Table>
    );
}

export default GroupDecks
