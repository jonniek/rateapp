import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

export default class NavBar extends Component{
  constuctor(props){
  }

  render(){
    return (
      <div>
        <div className="home-link center-children">
          <Link to="/"><h1>RateApp</h1></Link>
        </div>
        <Navbar collapseOnSelect>
          <Navbar.Header>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer exact to="/">
                <NavItem eventKey={1}>Home</NavItem>
              </LinkContainer>
            </Nav>
            <Nav>
              <LinkContainer exact to="/collections/">
                <NavItem eventKey={1}>Collections</NavItem>
              </LinkContainer>
            </Nav>
            <Nav pullRight>
              <LinkContainer exact to="/account/">
                <NavItem eventKey={1}>Account</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }
}