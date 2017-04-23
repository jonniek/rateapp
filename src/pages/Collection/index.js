import React, { Component } from 'react'
import './style.css'
import { Link } from 'react-router-dom'

export default class Collections extends Component {
  constructor(props){
    super()
    console.log(props)
    this.state = {
      users : [],
      fetched: false,
    }
  }

  componentDidMount() {
    fetch("/users").then(res => res.json()).then(users => this.setState({ users: users, fetched: true }))
  }

  render() {
    const users = this.state.users.map(user => <li key={user.id}>{ user.username }</li>)
    if (users.length === 0 && !this.state.fetched){
      return <div>Loading..</div>
    }else if(users.length===0){
      return <div>404 page not found</div>
    }else{
      return (
        <div>
          <h1>{ this.props.match.params.slug }</h1>
          <ul>
            { users }
          </ul>
          <Link to="/">Home</Link>
        </div>
      )
    }
  }
}
