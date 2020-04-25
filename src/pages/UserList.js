import React, { Component } from 'react';
import { Container, Table } from 'reactstrap';
import axios from 'axios';
import '../stylesheets/style.css';

import User from '../components/UserList/User';
import Template from './Template';

class UserList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      userID: '',
      users: []
    }
  }

  change(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  submit(e) {
    e.preventDefault();
    var data = {
      userID: this.state.userID,
    }
    var headers = {
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    }
      axios.post(this.props.serviceIP + '/admin', data, {headers:headers})
      .then(res => {
        console.log(res.data);
      }).catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    axios.get(this.props.serviceIP + '/users', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }).then(res => {
      console.log(res.data);
    this.setState({
      users : res.data });
    }).catch(function (error) {
      console.log(error);
    });
  }

  render() {
    return (
    <Container className="user-list">
      <Template/>
			<br></br><br></br>			
      <div>
      <h3>List of Users</h3>
        <Table hover className="tableList">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Permission</th>
            </tr>
          </thead>
          <tbody>
            {this.state.users.map((users) => {
              return (
                <User key={users.id} users={users}/>
              )
            })}
          </tbody>
        </Table>
      </div>
    </Container>
    )
  }
}

export default UserList
