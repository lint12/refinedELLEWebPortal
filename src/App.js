import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Template from './pages/Template';
import Downloads from './pages/Downloads';
import Groups from './pages/Groups';
import Decks from './pages/Decks';
import Profile from './pages/Profile';
import Sessions from './pages/Sessions';
import Login from './pages/Login'
import Logout from './pages/Logout'
import Signup from './pages/Signup';
import UserList from './pages/UserList';
import AuthUser from './components/Auth/AuthUser';
import AuthAdmin from './components/Auth/AuthAdmin';

let flaskIP = 'https://10.171.204.206';
flaskIP = 'https://endlesslearner.com';
//flaskIP = 'http://localhost:5000';

class App extends Component {
  constructor() {
    super();
    this.state = {
      LoggedIn: true,
      permission: 0,
    };
  }

  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/home" component={Home} />
            <Route path="/downloads" component={Downloads} />
            <Route path="/logout" render={(props)=><Logout {...props} serviceIP={flaskIP}/>}/>
            <Route path="/login" render={(props)=><Login {...props} serviceIP={flaskIP}/>}/>
            <Route path="/signup" render={(props)=><Signup {...props} serviceIP={flaskIP}/>}/>
            <AuthUser>
              <Route exact path="/" component={Template} />
              <Route path="/groups" render={(props)=><Groups {...props} serviceIP={flaskIP}/>}/>
              <Route path="/decks" render={(props)=><Decks {...props} serviceIP={flaskIP}/>}/>
              <Route path="/profile" render={(props)=><Profile {...props} serviceIP={flaskIP}/>}/>
              <Route path="/sessions" render={(props)=><Sessions {...props} serviceIP={flaskIP}/>}/>
              <AuthAdmin>
                <Route path="/userlist" render={(props)=><UserList {...props} serviceIP={flaskIP}/>}/>
              </AuthAdmin>
            </AuthUser>
          </Switch>
          </div>
      </Router>
    );
  }
}

export default App;
