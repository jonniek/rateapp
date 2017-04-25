import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { NavBar } from '../../Components/'

export default class Collections extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <h2>Collections</h2>
        <Link to="/">Home</Link><br />
        <Link to="/collections/number1">number1</Link>
        <Link to="/collections/number52">number52</Link>
      </div>
    );
  }
}
