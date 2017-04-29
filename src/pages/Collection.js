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
      fetched: false,
    }
    this.setWinner = this.setWinner.bind(this)
  }

  setWinner(winnerIndex){
    // TODO update result to server
    //const loserIndex = winnerIndex ? 0 : 1
    //const winnerId = this.state.images[this.state.selectedImages[winnerIndex]]
    //const loserId = this.state.images[this.state.selectedImages[loserId]]
    //fetch(`/collections/${collectionId}?w=${winnerId}&l=${loserId}`)

    // initialize our next images
    const imagecount = this.state.images.length
    const image1 = Math.floor(Math.random() * (imagecount ))
    let image2tmp = Math.floor(Math.random() * (imagecount ))
    while(image2tmp===image1 && imagecount>1){
      image2tmp = Math.floor(Math.random() * (imagecount ))
    }
    const image2 = image2tmp
    console.log(image1, image2)
    // initialize our next question
    const current = this.state.currentQuestion
    const len = this.state.questions.length
    const nextQuestion = current!==len-1 ? current+1 : 0

    // set our next state
    this.setState({ selectedImages:[image1, image2], currentQuestion: nextQuestion })
  }

  componentDidMount() {
    setTimeout(function(){
      this.setState({
        title: "Dota 2 heroes",
        questions: [
          "Which one is better?",
          "Which one wins 1v1 mid?",
          "Which have would you prefer to random?",
        ],
        currentQuestion: 0,
        selectedImages: [0, 1],
        images: [
          {url:"/images/uploads/Invoker_icon.png"},
          {url:"/images/uploads/Meepo_icon.png"},
          {url:"/images/uploads/Phantom_Assassin_icon.png"},
          {url:"/images/uploads/Phoenix.png"}
        ],
        fetched: true 
      })
    }.bind(this), 1000)
    //fetch("/users").then(res => res.json()).then(users => this.setState({ users: users, fetched: true }))
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
