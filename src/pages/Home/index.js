import React, { Component } from 'react'
import { NavBar } from '../../Components/'
import { Link } from 'react-router-dom'

class Home extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <h2>Welcome to RateApp!</h2>
        <div className="center-children">
          <p>Rateapp is a fun way to rank images into a certain order</p>
        </div>
        <div className="container">
          <div>Try a random collection!</div>

          <Link to="/collections/create"><div><img alt="create new" height="100" width="100" src={require('../../../public/images/plus.png')} />Create your own collection!</div></Link>

          <div>Browse all collections!</div>
        </div>
      </div>
    );
  }
}

export default Home
