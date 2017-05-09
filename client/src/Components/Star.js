import React, { Component } from 'react'

export default class Star extends Component{
  constructor(props){
    super();
    this.state = {
      stars: props.stars,
      starred: props.starred,
    }
    this.userid = props.userid
    this.userhash = props.userhash
    this.starid = props.starid
  }

  clickHandler(){
    if(!this.userid || !this.userhash) return;
    const method = !this.state.starred ? 'put':'delete'
    const url = "/api/users/"+this.userid+"/stars"
    const addCount = !this.state.starred ? 1:-1
    let data = {userhash:this.userhash, starid:this.starid}
    fetch(url, {
      method: method,
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    })
    this.setState({ starred: !this.state.starred, stars: this.state.stars+addCount })
  }

  componentDidMount(){

  }

  render(){
    const url = !this.state.starred ? require('../../public/images/star.png') : require('../../public/images/star-filled.png')
    return (
      <div className="star-container">
        <span>{this.state.stars}</span>
        <img style={{ cursor: 'pointer'}} alt="" onClick={ this.clickHandler.bind(this) } src={url} />
      </div>
    )
  }
}