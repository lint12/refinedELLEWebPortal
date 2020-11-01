import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class AuthAdmin extends Component {
  constructor(props) {
    super(props);
  }  

  componentDidMount() {
    const jwt = localStorage.getItem('jwt');;
    console.log("jwt: " + jwt); 

    if (!jwt) {
      this.props.history.push('/home');
    }
    else {
      var jwtDecode = require('jwt-decode');

      var decoded = jwtDecode(jwt);
      console.log("Auth Super Admin JWT DECODED: ", decoded);

      if (decoded.user_claims.permission !== "su" && this.props.location.pathname === "/userlist") {
        this.props.history.push('profile'); 
      }
      else if (decoded.user_claims.permission !== "pf" && this.props.location.pathname === "/classroster") {
        this.props.history.push('profile'); 
      }
      else if (this.props.location.pathname === "/") {
        this.props.history.push('profile');
      }
      else {
        this.props.history.push(this.props.location.pathname);
      }
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
