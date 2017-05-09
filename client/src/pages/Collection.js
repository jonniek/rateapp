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

  nextQuestion(questions){
    const current = this.state.currentQuestion
    const len = questions.length
    let next = current
    if(len>1){
      next = Math.floor(Math.random() * len)
      while(current===next){
        next = Math.floor(Math.random() * len)
      }
    }
    return next
  }

  setWinner(winnerIndex){
    // TODO update result to server
    //const loserIndex = winnerIndex ? 0 : 1
    const winner = this.state.images[this.state.selectedImages[winnerIndex]]
    const loser = this.state.images[this.state.selectedImages[winnerIndex===1?0:1]]
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
    
    const nextQuestion = this.nextQuestion(this.state.questions)

    // set our next state
    this.setState({ selectedImages:newImages, currentQuestion: nextQuestion })
  }

  componentDidMount() {
    fetch("/api/collections/"+this.props.match.params.slug)
      .then(res => res.json())
      .then(data => {
        const nextImages = this.nextImages(data.images)
        const nextQuestion = this.nextQuestion(data.subtitle)
        this.setState({ 
          title: data.title,
          questions: data.subtitle,
          images: data.images,
          selectedImages: nextImages,
          currentQuestion: nextQuestion,
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
            <h3 className="hidden-sm hidden-xs">{ this.state.questions[this.state.currentQuestion] }</h3>
            <div className="comparison-container center-children">
              <div className="row">
                <div className="col-md-5 col-sm-12 col-xs-12 left-image">
                  <ImageContainer onClick={this.setWinner} index={0} image={this.state.images[this.state.selectedImages[0]]} />
                </div>
                <div className="col-md-2 col-sm-12 col-xs-12 divisor">
                  <span className="versus hidden-sm hidden-xs">VS</span>
                  <h3 className="hidden-md hidden-lg hidden-xl">{ this.state.questions[this.state.currentQuestion] }</h3>
                </div>

                <div className="col-md-5 col-sm-12 col-xs-12 right-image">
                  <ImageContainer onClick={this.setWinner} index={1} image={this.state.images[this.state.selectedImages[1]]} />
                </div>
              </div>
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
