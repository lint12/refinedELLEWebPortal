import React from 'react';

import { Nav, NavItem, NavLink } from 'reactstrap';
import { NavLink as RNavLink} from 'react-router-dom';

const DeckNav = (props) => {
  const { decks, decksPathname } = props;
  return (
    <Nav vertical>
      <NavItem>
      {
        decks.map((deck) => (
            <NavLink
              key={deck.id}
              to={`${decksPathname}/${deck.id}`}
              className='item'
              tag={RNavLink}>
              {deck.name}
            </NavLink>
        ))
      }
      </NavItem>
    </Nav>
  )

};

export default DeckNav;
