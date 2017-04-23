import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'

import Home from './Home'
import Collections from './pages/Collections/'
import Collection from './pages/Collection/'
import NotFound from './pages/NotFound/'

const Routes = (props) => (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/collections/:slug" component={Collection} />
      <Route exact path="/collections" component={Collections} />
      <Route path="/404" component={NotFound} />
    </div>
  </Router>
)

export default Routes