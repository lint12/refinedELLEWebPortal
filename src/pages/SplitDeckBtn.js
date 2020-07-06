import React, { useState } from 'react';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'; 

const SplitDeckBtn = React.forwardRef((props, ref) => {
    const [dropdownOpen, setOpen] = useState(false);
  
    const toggle = () => setOpen(!dropdownOpen);
    return (
      <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
        <Button 
          style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}} 
          id="deckButton" 
          type="button"
          ref={ref}
          onClick={ () => {
            ref.current.updateDeck({ deck: props.curDeck })
        }}>{props.curDeck.name}</Button>
        <DropdownToggle caret color="info" style={{backgroundColor: '#5faeb5', border: 'none', borderRadius: '0px'}}/>
        <DropdownMenu style={{minWidth: '50px', padding: '0px', backgroundColor: 'gray'}}>
            <DropdownItem style={{padding: '4px 24px 4px 10px', backgroundColor: 'lightcyan', color: 'black', outline: 'none'}}>
              <img src={"./../../../tools.png"} alt="edit icon" style={{width: '18px', height: '18px'}}/> Edit</DropdownItem>
            <DropdownItem style={{padding: '4px 24px 4px 10px', backgroundColor: 'lightcoral', color: 'black', outline: 'none'}}>
              <img src={"./../../../delete.png"} alt="trash can icon" style={{width: '18px', height: '20px'}}/> Delete</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    );
  })

  export default SplitDeckBtn