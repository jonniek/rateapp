import React, { Component } from 'react'
import { NavBar, CollectionsTable } from '../Components/'
import { createUser, getUserDeep } from '../utils/'


export default class Account extends Component {

  constructor(){
    super()
    this.state = {
      fetched: false,
      username: "",
    }
  }

  componentDidMount() {
    createUser().then( (id) => getUserDeep(id)).then( data => {
      this.setState({
        fetched:true,
        username: data.username,
        userCollections: data.collections || [],
        starredCollections: data.stars || [],
      })
    })
  }

  render(){
    return(
      <div>
        <NavBar />
        { !this.state.fetched && <h2><div className="loader">Loading...</div></h2>}
        { this.state.fetched &&
          <div>
            <h2>Welcome to your page { this.state.username }!</h2>
            <p className="center-children">you can browse your collections and your starred collections below</p>
            <div className="collections">
              <CollectionsTable title="Your collections" collections={ this.state.userCollections } />
              <CollectionsTable hideCreate={true} title="Starred collections" collections={ this.state.starredCollections } />
            </div>
          </div>
        }
      </div>
    )
  }
}