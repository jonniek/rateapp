import React, { Component } from 'react'
import './style.css'
import { Link } from 'react-router-dom'

class Home extends Component {
  
  render() {
    return (
      <div>
        <Link to="/collections">Collections</Link><br />
        <Link to="/404">missing</Link><br />
        <Link to="/fassdfd">bad link</Link>
      </div>
    );
  }
}

export default Home
