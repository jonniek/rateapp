import React, { Component } from 'react'
import './style.css'
import { Link } from 'react-router-dom'

export default class Collections extends Component {
  render() {
    return (
      <div>
        <h1>Collections</h1>

        <Link to="/">Home</Link><br />
        <Link to="/collections/number1">number1</Link>
        <Link to="/collections/number52">number52</Link>
      </div>
    );
  }
}
