import React, { Component } from 'react'
import { NavBar } from '../../Components/'

export default class Collections extends Component {
  constructor(props){
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
  }

  handleSubmit(e){
    e.preventDefault()
    console.log(e.target.value)
  } 

  render() {
    return(
      <div>
        <NavBar />
          <div>
            <h2>Let's create a new collection!</h2>
            <hr />
            <form onSubmit={this.handleSubmit}>
              <label>Title<input id="title" type="text" /></label>
              <input type="submit" value="Create" />
            </form>
          </div>
      </div>
    )
  }
}
