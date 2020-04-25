import React from 'react';

import { Nav, NavItem, NavLink } from 'reactstrap';
import { NavLink as RNavLink} from 'react-router-dom';

const GroupNav = (props) => {
  const { groups, groupsPathname } = props;
  return (
    <Nav vertical>
      <NavItem>
      {
        groups.map((group) => {
        return (
            <NavLink
              key={group.groupID}
              to={`${groupsPathname}/${group.groupID}`}
              className='item'
              tag={RNavLink}
            >
              {group.groupName}
            </NavLink>
        )})
      }
      </NavItem>
    </Nav>
  )
};

export default GroupNav;
