import React from 'react';
import ReactDOM from 'react-dom';

import { HashRouter as Router, Route, Switch } from 'react-router-dom'

import Home from './pages/Home'
import Collections from './pages/Collections/'
import Results from './pages/Results/'
import Collection from './pages/Collection/'
import NotFound from './pages/NotFound/'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import './style.css';

ReactDOM.render(
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={ Home } />
        <Route exact path="/collections/:slug/results" component={Results} />
        <Route path="/collections/:slug" component={Collection} />
        <Route exact path="/collections" component={ Collections } />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>,
  document.getElementById('root')
);
