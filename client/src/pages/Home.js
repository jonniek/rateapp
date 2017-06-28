import React, { Component } from 'react'
import { NavBar } from '../Components/'
import { Link } from 'react-router-dom'
import { Grid, Col, Row } from 'react-bootstrap'
import { createUser, verifyToken, getUsers } from '../utils/'

export default class Home extends Component {
  constructor(){
    super()
    this.state = {
      randoming: false,
      users: [],
    }
  }

  goToRandom(){
    this.setState({randoming: true})
    fetch('/api/random/collection')
    .then(res => res.json() )
    .then( data => {
      this.props.history.push('/collections/'+data.url)
    })
  }

  async componentDidMount(){
    const loggedIn = await verifyToken()
    console.log(loggedIn)
    if(!loggedIn){
      createUser()
      console.log("no token, creating user")
    }else{
      console.log("Is token!")
    }
  }

  render() {
    return (
      <div>
        <NavBar />
        <h2>Welcome to RateApp!</h2>
        <div className="intro center-children">
          <p>Rateapp is a fun way to rank images into a certain order</p>
          <p>Users created: { this.state.users.length ? this.state.users.length : "..." } !</p>
        </div>
        { this.state.randoming && <h2><div className="loader">Loading...</div></h2> ||
          <Grid>
            <Row className="show-grid center-children suggestions">
            <Col sm={4}>
              <a style={{cursor:'pointer'}} onClick={this.goToRandom.bind(this)}>
                <img alt="try random" src={require('../../public/images/rand.png')} />
                <br/><span>Try a random collection!</span>
              </a>
            </Col>

            <Col sm={4}>
              <Link to="/collections">
                <img alt="browse all" src={require('../../public/images/all.png')} />
                <br/><span>Browse all collections!</span>
              </Link>
            </Col>

            <Col sm={4}>
              <Link to="/collections/create">
                <img alt="create new" src={require('../../public/images/plus.png')} />
                <br/><span>Create your own collection!</span>
              </Link>
            </Col>

            </Row>
          </Grid>
        }
      </div>
    );
  }
}