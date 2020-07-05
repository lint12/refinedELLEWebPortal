import React from 'react'
import { Button, ButtonGroup } from 'reactstrap';


class TermItem extends React.Component {
  constructor(props){
    super(props);
    this.deleteTerm = this.deleteTerm.bind(this);
    this.editTerm = this.editTerm.bind(this);

    this.state = {
      term: this.props.term
    }

  }

  deleteTerm = (event) => {
    console.log("DELETED TAG: ", this.state.term)
  }

  editTerm = (id) => {
    console.log(id)
  }

  /*
  downloadImg(id){
    //console.log(this.state.cards.imageLocation);
  }

  downloadAudio(id){
    //console.log(this.state.cards.audioLocation);
  }
  */


  render() {
    return (
  			
        <div>
          <Button style={{margin: "3px", border: "2px solid black"}}onClick={this.deleteTag} color="secondary">{this.state.term}</Button>
          {' '}
        </div>
      
    );
  }
}

export default TermItem