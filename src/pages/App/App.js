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
import ErrorPage from '../ErrorPage/ErrorPage';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        matchHistory: {},
    }
  }

  handleMatchHistory = (matchHistory) => {
    this.setState({matchHistory});
  }

  matchHistoryExists = () => {
    if(!this.state.matchHistory) {
      return false;
    }
    else if(Object.keys(this.state.matchHistory).length === 0) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    return (
      <div className="App">
        <Router>
          <div className="AppPage">
            <Switch>
              <Route exact path='/' render={(props) => 
                <WelcomePage 
                  {...this.state}
                  {...props}
                  handleMatchHistory={this.handleMatchHistory}
                />
              }/>
              <Route path='/summoner' render={(props) => (
                this.matchHistoryExists() ?
                <SearchPage  {...this.state} {...props} handleMatchHistory={this.handleMatchHistory} />
                 :
                <Redirect to='/error' {...this.state} {...props} handleMatchHistory={this.handleMatchHistory} />
              )}/>
              <Route path='/error' render={(props) => (
                <ErrorPage 
                  {...this.state}
                  {...props}
                  handleMatchHistory={this.handleMatchHistory}
                 />
              )}/>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
