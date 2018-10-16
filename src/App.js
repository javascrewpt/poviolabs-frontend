import React, { Component } from 'react';
// import logo from './logo.svg';
import { Route, Switch } from 'react-router-dom';
import Header from './Components/Header';
import List from './Components/List';
import { Container } from 'reactstrap';

import { BrowserRouter as Router } from 'react-router-dom';
import Provider from './State/Provider';

import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <Provider>
          <Container>
            <Header />
            <Switch>
              <Route exact path="/" component={List} />
            </Switch>
          </Container>
        </Provider>
      </Router>
    );
  }
}

export default App;
