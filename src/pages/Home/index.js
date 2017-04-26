import React, { Component } from 'react'
import { NavBar } from '../../Components/'

class Home extends Component {
  
  render() {
    return (
      <div>
        <NavBar />
        <h2>Welcome to RateApp!</h2>
        <div className="center-children">
          <p>Rateapp is a fun way to rank images into a certain order</p>
        </div>
      </div>
    );
  }
}

export default Home
