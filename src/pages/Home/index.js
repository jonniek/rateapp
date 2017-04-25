import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Home extends Component {
  
  render() {
    return (
      <div>
        <Link to="/collections">Collections</Link><br />
        <Link to="/404">missing</Link><br />
        <Link to="/fassdfd">bad lin</Link>
      </div>
    );
  }
}

export default Home
