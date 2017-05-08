import React, { Component } from 'react'

export default class Star extends Component{
  constructor(props){
    super();
    this.state = {
      stars: props.stars,
      stared: props.staed,
    }
    this.userid = localStorage.getItem("userid")
    this.userhash = localStorage.getItem("userhash")
    this.starid = props.starid
    console.log(props)
  }

  clickHandler(){
    if(!this.userid || !this.userhash) return;
    const method = !this.state.stared ? 'put':'delete'
    const url = "/api/users/"+this.userid+"/stars"
    const addCount = !this.state.stared ? 1:-1
    let data = {userhash:this.userhash, starid:this.starid}
    fetch(url, {
      method: method,
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    })
    this.setState({ stared: !this.state.stared, stars: this.state.stars+addCount })
  }

  componentDidMount(){
  }

  render(){
    const url = !this.state.stared ? require('../../public/images/star.png') : require('../../public/images/star-filled.png')
    return (
      <div className="star-container">
        <span>{this.state.stars}</span>
        <img style={{ cursor: 'pointer'}} alt="" onClick={ this.clickHandler.bind(this) } src={url} />
      </div>
    )
  }
}