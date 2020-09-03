import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Template from './pages/Template';
import Downloads from './pages/Downloads';
import Modules from './pages/Modules';
import Profile from './pages/Profile';
import SuperAdminProfile from './pages/SuperAdminProfile';
import Sessions from './pages/Sessions';
import Login from './pages/Login'
import Logout from './pages/Logout'
import Signup from './pages/Signup';
import UserList from './pages/UserList';
import ClassRoster from './pages/ClassRoster'; 
import Stats from './pages/Stats';
import AuthUser from './components/Auth/AuthUser';
import AuthAdmin from './components/Auth/AuthAdmin';


let flaskIP = 'https://endlesslearner.com:5000';
flaskIP = 'http://54.158.210.144:3000'; 
//flaskIP = 'http://45.55.61.182:5000/api';

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
            <Route path="/register" render={(props)=><Signup {...props} serviceIP={flaskIP}/>}/>
            <AuthUser>   
              <Route exact path="/" component={Template} />
              <Route path="/modules" render={(props)=><Modules {...props} serviceIP={flaskIP}/>}/>
              <Route path="/profile" render={(props)=><Profile {...props} serviceIP={flaskIP}/>}/>
              <Route path="/sessions" render={(props)=><Sessions {...props} serviceIP={flaskIP}/>}/>
              <AuthAdmin>  
                <Route path="/superadminprofile" render={(props)=><SuperAdminProfile {...props} serviceIP={flaskIP}/>}/>
                <Route path="/userlist" render={(props)=><UserList {...props} serviceIP={flaskIP}/>}/>
                <Route path="/stats" render={(props)=><Stats {...props} serviceIP={flaskIP}/>}/>
                <Route path="/classroster" render={(props)=><ClassRoster {...props} serviceIP={flaskIP}/>}/>
              </AuthAdmin>
            </AuthUser>
          </Switch>
          </div>
      </Router>
    );
  }
}

export default App;
