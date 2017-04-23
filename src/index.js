import React from 'react';
import ReactDOM from 'react-dom';

import { HashRouter as Router, Route, Switch } from 'react-router-dom'

import Home from './pages/Home'
import Collections from './pages/Collections/'
import Login from './pages/Login/'
import Collection from './pages/Collection/'
import NotFound from './pages/NotFound/'

import './index.css';

import AuthService from './utils/AuthService'
const auth = new AuthService('1KKSzBCaFJwxyCh7mT6EwTTSFJ6yfoX1', 'jonniek.eu.auth0.com');
console.log(auth)
//* validate authentication for private routes
const requireAuth = (nextState, replace, callback) => {
  console.log("TEST")
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' })
  }
}

const LoginPage = props => <Login auth={auth} {...props} />
const HomePage = props => <Home auth={auth} {...props} />
const CollectionsPage = props => <Collections auth={auth} {...props} />

ReactDOM.render(
  <Router>
    <div>
      <Switch>
        <Route exact path="/" render={ HomePage } />
        <Route path="/collections/:slug" component={Collection} />
        <Route exact path="/collections" onEnter={requireAuth} render={ CollectionsPage } />
        <Route exact path="/login" render={ LoginPage } />
        <Route component={NotFound} auth={ auth } />
      </Switch>
    </div>
  </Router>,
  document.getElementById('root')
);
