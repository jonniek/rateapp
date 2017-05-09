import React, { Component } from 'react'
import { NavBar, CollectionsTable } from '../Components/'
import { getUserDeep } from '../utils/'

export default class Account extends Component {
  constructor(){
    super()
    this.state = {
      fetched: false,
      username: "",
    }
  }

  componentDidMount(){
    getUserDeep(this.props.match.params.slug)
    .then( data => {
      console.log("hlleo", data)
      this.setState({
        fetched:true,
        username: data.username,
        userCollections: data.collections || [],
        starredCollections: data.stars || [],
      })
    })
  }

  render(){
    console.log("state", this.state)
    return(
      <div>
        <NavBar />
        { !this.state.fetched && <h2><div className="loader">Loading...</div></h2>}
        { this.state.fetched &&
          <div>
            <h2>Welcome to { this.state.username }'s page!</h2>
            <p className="center-children">you can browse their collections and starred collections below</p>
            <div className="collections">
              <CollectionsTable title="User collections" collections={ this.state.userCollections } />
              <CollectionsTable hideCreate={true} title="Starred collections" collections={ this.state.starredCollections } />
            </div>
          </div>
        }
      </div>
    )
  }
}