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

  constructor(props) {
    super(props);
    this.state = {
        matchHistory: {},
    }
  }

  handleMatchHistory = (matchHistory) => {
    this.setState({matchHistory}, () => {
      console.log(this.state.matchHistory);
    })
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
                <SearchPage 
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
