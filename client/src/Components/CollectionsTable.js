import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Star } from '../Components'
//import { LinkContainer } from 'react-router-bootstrap'
import { ButtonToolbar, DropdownButton, MenuItem, Button, Clearfix } from 'react-bootstrap'
import { createUser, getUser } from '../utils/'

export default class Collections extends Component {

  constructor(props){
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
      userStars: [],
      search: "",
    }
    this.hideCreate = props.hideCreate || false
    this.useCollection = props.collections || false
  }

  componentDidMount() {
    createUser().then( (id) => getUser(id)).then( user => {
      const stars = user.stars || []

      if(this.useCollection===false){
        const fetchstring = !this.props.user ? "/api/collections" : `/api/users/${this.props.user}/collections`
        fetch(fetchstring)
          .then(res => res.json())
          .then(data => {
            this.parseCollection(data, stars)
          })
      }else{
        this.parseCollection(this.useCollection, stars)
      }
    })
  }

  parseCollection(data, stars){
    if(!data || !data.length){
      data = []
    }else{
      data.forEach(field => {
        field.url = "/collections/"+field.url
        field.categories = field.categories || []
        if(field.images.length>0){
          field.image = 
            field.images[Math.floor(Math.random() * field.images.length)].url
          delete field.images
        }else{
          delete field.images
          field.image = require('../../public/images/noimage.png')
        }
      })
    }
    this.setState({
      collections: data,
      userStars: stars,
      fetched: true
    })
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
      .filter( item => item.title.toLowerCase().includes(this.state.search.toLowerCase()) || item.categories
        .reduce( (found, next) => {
          if(!found && next.toLowerCase().includes(this.state.search.toLowerCase())) return true
          return found
        }, false)
      )
      .sort(this.sort_functions[this.state.sort].bind(this))
      .map( (item, index) => {
        const starred = this.state.userStars.indexOf(item._id)!==-1?true:false
        return(
          <div key={item._id} className="collection-card">
            <Link to={item.url}>
              <div className="loader cardloader">Loading...</div>
              <div
                className="card-image"
                style={{ background: `url(${item.image}) no-repeat scroll center`}}>
              </div>
            </Link>
            <div className="card-info">
              <h3><Link to={item.url}>{item.title}</Link></h3>
              <Star
                starid={item._id}
                starred={starred}
                stars={item.stars}
                userid={localStorage.getItem("userid")}
                userhash={localStorage.getItem("userhash")}
              />
              <div className="table">
                <div><span>Votes:</span><span>{item.votes}</span></div>
                <div><span>Categories:</span><span>{item.categories.map( (cat,i) => {
                    return(
                      <span
                        onClick={this.setSearch.bind(this, cat)}
                        key={i}
                        className="cat"
                      >{cat}</span>
                  )})}
                  </span>
                </div>
                <div><span>Creator:</span>
                  <span><Link to={{ pathname: `/users/${item.ownerId._id}`, user: item.ownerId.username }}>
                      { item.ownerId.username }
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      })
    console.log(this.state)
    return (
      <div className="collection-table">
        <div className="container">
          <div>
            <h2>{this.props.title || "Collections" }</h2>
            { this.state.collections.length === 0 && 
              !this.state.fetched && <h2><div className="loader">Loading...</div></h2>
            }
            { this.state.collections.length === 0 && this.state.fetched && <h3>no collections found</h3>}
            { this.state.collections.length !== 0 &&
            <div>
              <hr />
              <ButtonToolbar>

                {!this.hideCreate &&
                  <Link className="createnew" to="/collections/create">
                    <img alt="create new" height="50" width="50" src={require('../../public/images/plus.png')} />
                    <span>Create!</span>
                  </Link>
                }

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
                <Clearfix visibleXsBlock></Clearfix>
                <Button onClick={this.toggleSortOrder.bind(this)}>
                  {`order: ${this.state.sort_descending===1?'desc':'asc'}`}
                </Button>
                <Clearfix visibleXsBlock></Clearfix>
                <span className="search">
                  <input value={ this.state.search } onChange={this.setSearch.bind(this)} placeholder="search" />
                  {this.state.search && 
                    <span className="search-x" onClick={this.setSearch.bind(this, "")}>x</span>
                  }
                </span>
              </ButtonToolbar>
              <hr />
              <div className="collections-container center-children">
                {collections}
              </div>
            </div>
            }
        </div>
      </div>
    </div>
    );
  }
}
