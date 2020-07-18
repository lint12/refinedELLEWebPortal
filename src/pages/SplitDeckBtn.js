import React, { useState } from 'react';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Popover, PopoverHeader, PopoverBody, 
  Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'; 

  const SplitDeckBtn = (props) => {
    const [dropdownOpen, setOpen] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false); 
    const [editedModuleName, setName] = useState(props.curModule.name);
  
    const toggle = () => setOpen(!dropdownOpen);
    const togglePopover = () => setPopoverOpen(!popoverOpen);
    const toggleModal = () => setModalOpen(!modalOpen); 
    
    return (
      <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
        <Button 
          style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%", backgroundColor: "#5faeb5",
                  border: "none", borderBottomLeftRadius: "0px", borderTopLeftRadius: "0px"}} 
          id={"deckButton" + props.id}
          type="button"
          onClick={ () => {
            console.log("SplitDeckBtn: ", props.curModule); 
            props.updateCurrentModule({ module: props.curModule })
        }}>{props.curModule.name}
        </Button>
        <Popover trigger="legacy" placement="bottom" isOpen={popoverOpen} target={"deckButton" + props.id}>
          <PopoverHeader>
            Edit Module 
            <Button close onClick={ () => { togglePopover() }}/>
          </PopoverHeader>
          <PopoverBody>
            <Form>
              <FormGroup>
                <Label for="moduleName">Name:</Label>
                <Input type="text" name="mName" id="moduleName" autoComplete="off" 
                  value={editedModuleName} onChange={ e => setName(e.target.value) }/>
              </FormGroup>
              <Button onClick={ () => {
                props.editModule(editedModuleName, { module: props.curModule })
                togglePopover()
              }}>Submit</Button>
            </Form>
          </PopoverBody>
        </Popover>
        
        <DropdownToggle caret color="info" style={{backgroundColor: '#5faeb5', border: 'none', borderRadius: '0px'}}/>
        <DropdownMenu style={{minWidth: '50px', padding: '0px', backgroundColor: 'gray'}}>
            <DropdownItem style={{padding: '4px 24px 4px 10px', backgroundColor: 'lightcyan', color: 'black', outline: 'none'}}
              onClick={ () => { togglePopover() }}>
              <img src={"./../../../tools.png"} alt="edit icon" style={{width: '18px', height: '18px'}}/> Edit</DropdownItem>
            <DropdownItem style={{padding: '4px 24px 4px 10px', backgroundColor: 'lightcoral', color: 'black', outline: 'none'}}
              onClick={ () => { toggleModal() }}>
              <img src={"./../../../delete.png"} alt="trash can icon" style={{width: '18px', height: '20px'}}/> Delete</DropdownItem>
        </DropdownMenu>
        <Modal isOpen={modalOpen}> 
          <ModalHeader toggle={toggleModal}>Delete</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete the module: {props.curModule.name}?</p>
          </ModalBody>
          <ModalFooter>
            <Button onClick={ () => {toggleModal()} }>Cancel</Button>
            <Button color="danger" onClick={ () => {
              props.deleteModule(props.id) 
              toggleModal()
              }}>Delete</Button>
          </ModalFooter>
        </Modal>
      </ButtonDropdown>
    );
  }

  export default SplitDeckBtn