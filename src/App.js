import React, { Component } from 'react';
// import logo from './logo.svg';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';

import Header from './Components/Header';
import List from './Components/List';
import SignUp from './Components/SignUp';
import User from './Components/User';
import Me from './Components/Me';

import Provider from './State/Provider';
import Context from './State/Context';

import './App.css';


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Context.Consumer>
    {state => (
      <Route {...rest} render={(props) => (
        state.user.data
          ?
          <Component {...props} />
          :
          <Redirect to='/' />
      )} />
    )}
  </Context.Consumer>
);


class App extends Component {
  render() {
    return (
      <Router>
        <Provider>
          <Container>
            <Header />
            <Switch>
              <Route exact path="/" component={List} />
              <Route path="/user/:id" component={User} />
              <Route path="/sign-up" component={SignUp} />
              <PrivateRoute path="/me" component={Me} />
              <Redirect to="/" />
            </Switch>
          </Container>
        </Provider>
      </Router>
    );
  }
}

export default App;
