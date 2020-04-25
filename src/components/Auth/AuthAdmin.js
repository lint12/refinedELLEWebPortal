import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class AuthAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userID: undefined,
      perm: undefined

    };
  }

  componentDidMount() {
    const jwt = localStorage.getItem('jwt');;
    const per = localStorage.getItem('per');;
    if(!jwt) {
      this.props.history.push('/home');
    }else if (per === 'at' || per === 'us') {
      this.props.history.push('/sessions');
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
