import React, { Component } from 'react'
import { NavBar, CollectionsTable } from '../Components/'

export default class Account extends Component {
  render(){
    const userid = localStorage.getItem("userid")
    const username = localStorage.getItem("username") || "anon"
    return(
      <div>
        <NavBar />
        <h2>Welcome to your page { username }!</h2>
        <p className="center-children">you can browse your collections below</p>
        <div className="collections">
          <CollectionsTable user={ userid } />
        </div>
      </div>
    )
  }
}