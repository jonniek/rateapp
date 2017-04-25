import React, { Component } from 'react'
import { Navbar, Nav, NavDropdown, NavItem, MenuItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

export default class ImageContainer extends Component{
  constuctor(props){
  }

  clickHandler(){
    this.props.onClick(this.props.index)
  }

  render(){
    return (
      <div>
        <h1>RateApp</h1>
        <Navbar collapseOnSelect inverse>
          <Navbar.Header>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer exact to="/collections/">
                <NavItem eventKey={1}>Collections</NavItem>
              </LinkContainer>
            </Nav>
            <Nav pullRight>
              <NavDropdown eventKey={1} title="Account" id="basic-nav-dropdown">
                <MenuItem eventKey={1.1}>My page</MenuItem>
                <MenuItem eventKey={1.2}>Logout</MenuItem>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }
}