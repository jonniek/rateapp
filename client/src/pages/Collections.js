import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { NavBar, CollectionsTable } from '../Components/'
//import { LinkContainer } from 'react-router-bootstrap'
import { ButtonToolbar, DropdownButton, MenuItem, Button } from 'react-bootstrap'

export default class Collections extends Component {
  render() {    
    return (
      <div className="collections">
        <NavBar />
        <CollectionsTable />
      </div>
    )
  }
}
