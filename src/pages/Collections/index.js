import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { NavBar } from '../../Components/'
//import { LinkContainer } from 'react-router-bootstrap'
import { ButtonToolbar, DropdownButton, MenuItem, Button } from 'react-bootstrap'

export default class Collections extends Component {

  constructor(){
    super();
    this.sort_functions = {
      stars: (a,b) => this.state.sort_descending*(a.stars < b.stars ? 1 : -1),
      title: (a,b) => this.state.sort_descending*(a.title < b.title ? 1 : -1),
    }
    this.state = {
      collections: [],
      fetched: false,
      sort_descending: 1,
      sort: 'stars',
      search: "",
    }
  }

  componentDidMount() {
    setTimeout(function(){
      this.setState({
        collections: [
          { url:"/collections/number52", title:"52 something", categories:["gifs"], image:"/images/uploads/banner.png", stars:35 },
          { url:"/collections/number1", title:"Dota2 heroes", categories:["gifs"], image:"/images/uploads/banner.png", stars:31 },
          { url:"/collections/number52", title:"Best grill", categories:["coding"], image:"/images/uploads/banner.png", stars:15 },
          { url:"/collections/number1", title:"jakjnfas", categories:["games"], image:"/images/uploads/banner.png", stars:335 },
          { url:"/collections/number1", title:"lorem ipsum som dolore", categories:["gifs","dota"], image:"/images/uploads/banner.png", stars:44 },
          { url:"/collections/number52", title:"212151 123 1233", categories:["games","dota"], image:"/images/uploads/banner.png", stars:135 },
        ],
        fetched: true 
      })
    }.bind(this), 1000)
    //fetch("/users").then(res => res.json()).then(users => this.setState({ users: users, fetched: true }))
  }

  setSearch(event){
    const str = typeof event==="string" ? event : event.target.value
    this.setState({ search: str })
  }

  toggleSortOrder(){
    this.setState({ sort_descending: this.state.sort_descending===1?-1:1 })
  }

  setSort(str){
    this.setState({ sort: str })
  }

  render() {
    const collections = this.state.collections
      .filter( item => item.title.includes(this.state.search) || item.categories
        .reduce( (found, next) => {
          if(!found && next.includes(this.state.search)) return true
          return found
        }, false)
      )
      .sort(this.sort_functions[this.state.sort].bind(this))
      .map( (item, index) => {
        return(
          <div key={index} className="collection-card">
            <Link to={item.url}>
              <div
                className="card-image"
                style={{ background: `url(${item.image}) no-repeat scroll center`}}>
              </div>
            </Link>
            <div className="card-info">
              <Link to={item.url}><h3>{item.title}</h3></Link>
              <div>Stars: {item.stars}</div>
              <div>Categories: {item.categories.map( (cat,i) => {
                  return(
                    <span
                      onClick={this.setSearch.bind(this, cat)}
                      key={i}
                      className="cat"
                    >{cat}</span>
                )})}
              </div>
            </div>
          </div>
        )
      })
    
    return (
      <div className="collections">
        <NavBar />
        { this.state.collections.length === 0 && !this.state.fetched && <h2><div className="loader">Loading...</div></h2>}
        { this.state.collections.length === 0 && this.state.fetched && <h2>404 collections found</h2>}
        { this.state.collections.length !== 0 &&
          <div className="container">
            <div>
              <h2>Collections</h2>
              <hr />
              <ButtonToolbar>
                <DropdownButton
                  title={`sort by: ${this.state.sort}`}
                  id="dropdown-size-medium"
                >
                  <MenuItem
                    onClick={this.setSort.bind(this, "stars")}
                    active={this.state.sort==="stars"}
                    eventKey="1"
                  >stars</MenuItem>
                  <MenuItem
                    onClick={this.setSort.bind(this, "title")}
                    active={this.state.sort==="title"}
                    eventKey="2"
                  >title</MenuItem>
                </DropdownButton>
                <Button onClick={this.toggleSortOrder.bind(this)}>
                  {`order: ${this.state.sort_descending===1?'desc':'asc'}`}
                </Button>
                <span className="search">
                  <input className="sea" value={ this.state.search } onChange={this.setSearch.bind(this)} placeholder="search" />
                  <span className="search-x" onClick={this.setSearch.bind(this, "")}>x</span>
                </span>
              </ButtonToolbar>
            </div>
            <hr />
            <div className="collections-container center-children">
              {collections}
            </div>
          </div>
        }
      </div>
    );
  }
}
