import React, { Component } from 'react'

export default class ImageContainer extends Component{
  clickHandler(){
    this.props.onClick(this.props.index)
  }

  render(){
    const url = this.props.image.url
    return (
      <div className="image-container">
        <img style={{ cursor: 'pointer'}} alt="" onClick={ this.clickHandler.bind(this) } src={url} />
      </div>
    )
  }
}