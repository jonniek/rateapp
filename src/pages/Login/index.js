import React, { Component, PropTypes as T } from 'react'
import './style.css'
//import { Link } from 'react-router-dom'
import AuthService from '../../utils/AuthService'

export default class Login extends Component {
  constructor(props){
    super()
    console.log(props)
  }

  static propTypes = {
    location: T.object,
    auth: T.instanceOf(AuthService)
  }

  render() {
    const { auth } = this.props
    console.log(auth)
    return (
      <div> 
        <h2>Login</h2>
        <button onClick={auth.login.bind(this)}>Login</button>
      </div>
    );
  }
}
