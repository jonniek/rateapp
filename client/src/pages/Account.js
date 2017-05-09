import React, { Component } from 'react'
import { NavBar, CollectionsTable } from '../Components/'
import { createUser, getUserDeep, saveName } from '../utils/'
import { Button } from 'react-bootstrap'


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

  updateName(e){
    this.setState({ username: e.target.value })
  }

  saveName(){
    saveName(this.state.username).then( data => {
      alert(data)
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
            <div className="center-children namechange">
              <div className="singleField">
                <label for="newname">Change your name</label><br />
                <input type="text" value={this.state.username} onChange={this.updateName.bind(this)} />
                <Button tabIndex="-1" className="add" bsSize="small" onClick={this.saveName.bind(this)}>Save</Button>
              </div>
            </div>
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