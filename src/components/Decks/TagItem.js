import React from 'react'
import { Button, ButtonGroup } from 'reactstrap';


class TagItem extends React.Component {
  constructor(props){
    super(props);
    this.deleteTag = this.deleteTag.bind(this);
    this.editTag = this.editTag.bind(this);

    this.state = {
      tag: this.props.tag
    }

  }

  deleteTag = (event) => {
    console.log("DELETED TAG: ", this.state.tag)
  }

  editTag = (id) => {
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
          <Button style={{margin: "3px", border: "2px solid black"}}onClick={this.deleteTag} color="secondary">{this.state.tag}</Button>
          {' '}
        </div>
      
    );
  }
}

export default TagItem