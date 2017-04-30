import React, { Component } from 'react'
import { NavBar, CollectionsTable } from '../Components/'

export default class Account extends Component {
  constructor(){
    super()
    this.state = {
      username: "",
    }
  }
  componentDidMount(){
    fetch('/api/users/'+this.props.match.params.slug)
      .then(res => res.json())
      .then(data => {
        this.setState({
          username: data.username,
        })
      })
  }
  render(){
    const name = this.state.username?this.state.username:"_______"
    return(
      <div>
        <NavBar />
        <h2>Welcome to { name }'s page!</h2>
        <p className="center-children">you can browse all their collections below</p>
        <div className="collections">
          <CollectionsTable user={ this.props.match.params.slug } />
        </div>
      </div>
    )
  }
}