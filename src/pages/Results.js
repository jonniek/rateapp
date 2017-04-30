import React, { Component } from 'react'
import { NavBar } from '../Components/'
import { LinkContainer } from 'react-router-bootstrap'
import { DropdownButton, MenuItem, Button } from 'react-bootstrap'

export default class Results extends Component {

  constructor(props){
    super()
    this.state = {
      questions: [],
      images: [],
      fetched: false,
      descending: 1,
    }
    console.log(props)

    this.sort_algorithms = {
      handler: (a,b) => {
        if(this.state.selectedQuestion===-1){
          return this.sort_algorithms.average(a,b)
        }else{
          return this.sort_algorithms.one(a,b)
        }
      },
      average: (a,b) => {
        const avga = a.rating.rating.reduce((total, next) => total+=next, 0)/a.rating.rating.length
        const avgb = b.rating.rating.reduce((total, next) => total+=next, 0)/b.rating.rating.length
        return this.state.descending * ( avga < avgb ? 1 : -1)
      },
      one: (a,b) => {
        const index = this.state.selectedQuestion
        return this.state.descending * (a.rating.rating[index] < b.rating.rating[index] ? 1 : -1)
      }
    }
  }

  toggleDescending(){
    this.setState({ descending : this.state.descending===1?-1:1 })
  }

  componentDidMount(){
    fetch("/collections/"+this.props.match.params.slug)
      .then(res => res.json())
      .then(data => {
        this.setState({ 
          title: data.title,
          questions: data.subtitle,
          images: data.images,
          selectedQuestion: -1,
          fetched: true
        })
      })
  }

  setQuestion(index){
    this.setState({ selectedQuestion: index })
  }
  
  render() {
    const selected = this.state.selectedQuestion===-1 ? "Average score":
      this.state.questions[this.state.selectedQuestion]

    const images = this.state.images
      .sort(this.sort_algorithms.handler.bind(this))
      .map((image, index) => {
        const id = this.state.descending===1?index+1:this.state.images.length-index
        return (
          <div key={index} className="result-image">
            <span className="order-num">{id}</span> 
            <img src={image.url} alt="" />
          </div>
        )
      })

    const menuItems = this.state.questions.map((question, index) => {
      return (
        <MenuItem
          onClick={this.setQuestion.bind(this, index)}
          active={this.state.selectedQuestion===index}
          eventKey={index+2}
          key={index}
        >{ question }</MenuItem>
      )
    })
    console.log(this.state)
    return (
      <div className="results-page">
        <NavBar />
        { this.state.images.length === 0 && !this.state.fetched && <h2><div className="loader">Loading...</div></h2>}
        { this.state.images.length === 0 && this.state.fetched && <h2>404 Page not found</h2>}
        { this.state.images.length !== 0 &&
          <div>
            <h2>{ this.state.title }</h2>
            <hr />
            <h3>Results</h3>
            <div className="comparison-container center-children">

              <LinkContainer exact to={`/collections/${this.props.match.params.slug}/`}>
                <Button className="results">Back to comparing</Button>
              </LinkContainer>
              <div className="question-container">
                <DropdownButton
                  title={ selected }
                  id="dropdown-size-medium"
                >
                  <MenuItem
                    onClick={this.setQuestion.bind(this, -1)}
                    active={this.state.selectedQuestion===-1}
                    eventKey="1"
                  >Average score</MenuItem>
                  { menuItems }
                </DropdownButton>
                <Button
                  className={this.state.descending===1?'best':'worst'}
                  onClick={this.toggleDescending.bind(this)}
                >{this.state.descending===1?"Best":"Worst"}
                </Button>
              </div>
              <div className="result-image-container">{ images }</div>
            </div>
          </div>
        }
      </div>
    )
  }
}
