import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Login from './components/Login';
import Signup from './components/Signup';
import Notes from './components/Notes';
import Main from './components/Main';


class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/notes" component={Notes} />
          <Route exact path="/main" component={Main} />
          <div>
            { console.log(document) }
          </div>
        </div>


      </Router>
    );
  }
}

export default App;
