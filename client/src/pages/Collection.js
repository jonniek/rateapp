import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import { ImageContainer, NavBar } from '../Components/'

export default class Collections extends Component {
  constructor(props){
    super()
    this.state = {
      questions: [],
      images : [],
      currentQuestion: 0,
      selectedImages: [0, 1],
      fetched: false,
    }
    this.setWinner = this.setWinner.bind(this)
  }

  nextImages(array){
    const imagecount = array.length
    const image1 = Math.floor(Math.random() * (imagecount ))
    let image2tmp = Math.floor(Math.random() * (imagecount ))
    while(image2tmp===image1 && imagecount>1){
      image2tmp = Math.floor(Math.random() * (imagecount ))
    }
    const image2 = image2tmp
    return [image1, image2]
  }

  setWinner(winnerIndex){
    // TODO update result to server
    //const loserIndex = winnerIndex ? 0 : 1
    const winner = this.state.images[this.state.selectedImages[winnerIndex]]
    const loser = this.state.images[this.state.selectedImages[winnerIndex===1?0:1]]
    console.log(winner)
    fetch("/api/collections/"+this.props.match.params.slug+"/rating", {
      method: "PUT",
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        winner: winner.rating._id,
        loser: loser.rating._id,
        question: this.state.currentQuestion,
      })
    })

    // initialize our next images
    const newImages = this.nextImages(this.state.images)
    // initialize our next question
    const current = this.state.currentQuestion
    const len = this.state.questions.length
    const nextQuestion = current!==len-1 ? current+1 : 0

    // set our next state
    this.setState({ selectedImages:newImages, currentQuestion: nextQuestion })
  }

  componentDidMount() {
    fetch("/api/collections/"+this.props.match.params.slug)
      .then(res => res.json())
      .then(data => {
        const nextImages = this.nextImages(data.images)
        this.setState({ 
          title: data.title,
          questions: data.subtitle,
          images: data.images,
          selectedImages: nextImages,
          fetched: true
        })
      })
  }

  render() {
    return(
      <div>
        <NavBar />
        { this.state.images.length === 0 && !this.state.fetched && <h2><div className="loader">Loading...</div></h2>}
        { this.state.images.length === 0 && this.state.fetched && <h2>404 Page not found</h2>}
        { this.state.images.length !== 0 &&
          <div className="container">
            <h2>{ this.state.title }</h2>
            <hr />
            <h3>{ this.state.questions[this.state.currentQuestion] }</h3>
            <div className="comparison-container center-children">
              <ImageContainer onClick={this.setWinner} index={0} image={this.state.images[this.state.selectedImages[0]]} />
              <span className="versus">VS</span>
              <ImageContainer onClick={this.setWinner} index={1} image={this.state.images[this.state.selectedImages[1]]} />
              <div className="clearfix" />
              <LinkContainer exact to={`/collections/${this.props.match.params.slug}/results`}>
                <Button className="results">Results</Button>
              </LinkContainer>
            </div>
          </div>
        }
      </div>
    )
  }
}
