import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class AuthAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userID: undefined,
      per: undefined

    };
  }

  componentDidMount() {
    const jwt = localStorage.getItem('jwt');;
    console.log("jwt: " + jwt); 

    if(!jwt) {
      this.props.history.push('/');
    }    
  }

  render () {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

export default withRouter(AuthAdmin);
