import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
import WelcomePage from '../WelcomePage/WelcomePage';
import SearchPage from '../SearchPage/SearchPage';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div className="AppPage">
            <Switch>
              <Route exact path='/' render={(props) => 
                <WelcomePage 
                  {...props}
                />
              }/>
              <Route path='/summoner' render={(props) => (
                <SearchPage {...props} />
              )}/>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
