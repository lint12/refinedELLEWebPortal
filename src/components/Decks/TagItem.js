import React from 'react'
import { Button } from 'reactstrap';


class TagItem extends React.Component {
  constructor(props){
    super(props);
    this.editTag = this.editTag.bind(this);

    this.state = {
      removeMode: false
    }


  }


  setStyle = () => {
    if(this.state.removeMode === false){
      return {margin: "3px", border: "2px solid black"}
    } else {
      return {margin: "3px", border: "2px solid black", backgroundColor: "red"}
    }
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
    if(this.props.deletable === true){
      return (
    			
          <div>
            <Button style={this.setStyle()}  color="secondary" 
            onClick={() => {this.props.handleDeleteTag({tag: this.props.tag})}}
            onMouseOver={() => {this.setState({removeMode: true})}}
            onMouseOut={() => this.setState({removeMode: false})}
            >
              {this.props.tag}
            </Button>
            {' '}
          </div>
      );
    } else {
      return(
        <div>
          <Button style={this.setStyle()}  color="secondary" >
            {this.props.tag}
          </Button>
          {' '}
        </div>
        );
    

    }
  }
}

export default TagItem