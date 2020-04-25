import React from 'react';
import Session from './Session';

const SessionList = (props) => {
    return (
      <ul>
          {props.sessions.map((sessions) => {
            return (
              <Session
                key={sessions.name}
                sessions={sessions}/>
            )
          })}
      </ul>
    );
}

export default SessionList
