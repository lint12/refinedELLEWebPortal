import React from 'react';

import { Nav, NavItem, NavLink } from 'reactstrap';
import { NavLink as RNavLink} from 'react-router-dom';

const SessionNav = (props) => {
  const { sessions, sessionsPathname } = props;
  return (
    <Nav vertical>
      <NavItem>
      {
        sessions.map((session) => {
        return (
            <NavLink
              key={session.sessionID}
              to={`${sessionsPathname}/${session.sessionID}`}
              className='item'
              tag={RNavLink}
            >
              {session.sessionDate} -- {session.responseScore}
            </NavLink>
        )})
      }
      </NavItem>
    </Nav>
  )

};

export default SessionNav;
