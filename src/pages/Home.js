import React, { Component } from 'react'
import { NavBar } from '../Components/'
import { Link } from 'react-router-dom'
import { Grid, Col, Row } from 'react-bootstrap'

class Home extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <h2>Welcome to RateApp!</h2>
        <div className="intro center-children">
          <p>Rateapp is a fun way to rank images into a certain order</p>
        </div>
        <Grid>
          <Row className="show-grid center-children suggestions">
          <Col sm={4}>
            <Link to="/collections/random">
              <img alt="try random" src={require('../../public/images/rand.png')} />
              <br/><span>Try a random collection!</span>
            </Link>
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
      </div>
    );
  }
}

export default Home
