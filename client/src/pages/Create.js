import React, { Component } from 'react'
import { NavBar } from '../Components/'
import Dropzone from 'react-dropzone'
import { Button } from 'react-bootstrap'

export default class Collections extends Component {
  constructor(props){
    super()
    this.state = {
      title: "",
      comparisons: [""],
      categories: [],
      files: [],
      error: "",
      dropzoneActive: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  onDragEnter() {
    this.setState({
      dropzoneActive: true
    })
  }

  onDragLeave() {
    this.setState({
      dropzoneActive: false
    })
  }

  componentDidMount(){
    if(localStorage){
      const id = localStorage.getItem("userid")
      const hash = localStorage.getItem("userhash")
      if(id && hash){
        this.userid = id
        this.userhash = hash
      }else{
        fetch("/api/users", {
          method: "POST",
        }).then( res => res.json() )
        .then( res => {
          this.userid = res._id
          this.userhash = res.password
          if(localStorage){
            localStorage.setItem("userid", res._id)
            localStorage.setItem("userhash", res.password)
            localStorage.setItem("username", res.username)
          }
        })
      }
    }else{
      this.userid = ""
      this.userhash = ""
    }
  }

  componentWillUnmount(){
  }

  uploadFile(file){
    let data = new FormData();
    data.append("image", file)
    fetch("/api/image", {
      method: "POST",
      body: data
    }).then( res => res.json() )
    .then( res => {
      let files = this.state.files
      files.forEach( (f,i) => {
        if(f[0].preview === file.preview){
          files[i][1] = false
          files[i][2] = res.filename
        }
      })
      this.setState({ files })
    })
  }

  onDrop(files, a, b) {
    let newFiles = this.state.files
    files.forEach((file, index) => {
      newFiles.push([file, true])
      this.uploadFile.call(this, file)
    })
    this.setState({
      files: newFiles,
      dropzoneActive: false
    })
  }

  removeFile(filed){
    let newFiles = this.state.files
    newFiles = newFiles.filter(file => {
      return file[0].preview !== filed.preview
    })
    if(window){
      window.URL.revokeObjectURL(filed);
    }
    this.setState({ files: newFiles })
  }

  setField(target, e){
    let object = {}
    if(target==="categories"){
      object[target] = e.target.value.toLowerCase().replace(/\s+/g,' ').trim().split(" ")
        .reduce( (res, next) => { if(!res.includes(next)){res.push(next)} return res } , [] )
    }else{
      object[target] = e.target.value
    }
    this.setState(object)
  }

  setComparison(index, e){
    let newComparison = this.state.comparisons
    newComparison[index] = e.target.value
    this.setState({ comparisons: newComparison })
  }

  addComparison(){
    let newComparison = this.state.comparisons
    newComparison.push("")
    this.setState({ comparisons: newComparison })
  }

  removeComparison(index){
    let newComparison = this.state.comparisons
    newComparison.splice(index, 1)
    this.setState({ comparisons: newComparison })
  }
  setError(error){
    this.setState({error})
    setTimeout(() => {
      this.setState({error: ""})
    }, 3000)
  }

  handleSubmit(e){
    e.preventDefault()
    console.log(this.userid)
    const uploading = this.state.files.
      reduce((bool, nfile) => {
        if(nfile[1]==true){ bool = true }
        return bool
      }, false)
    if(uploading){
      this.setError("Images are still uploading")
      return
    }else if(!this.state.title || this.state.comparisons.length<1){
      this.setError("You need a title and at least one question!")
      return
    }else if(this.state.files.length<3){
      this.setError("You should upload at least 3 images")
      return
    }else if(this.userid==""){
      alert("Unknown error, try refreshing the page")
      return
    }
    let data = {
      ownerId: this.userid,
      ownerHash: this.userhash,
      title: this.state.title,
      subtitle: this.state.comparisons,
      categories: this.state.categories,
      images: this.state.files.map(file => file[2])
    }
    fetch("/api/collections", {
      method: "POST",
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data)
    }).then( res => res.json() )
    .then( res => {
      this.props.history.push('/collections/'+res.url)
    })
  } 

  render() {
    const { files, dropzoneActive } = this.state
    const overlayStyle = {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex:10,
      padding: '2.5em 0',
      background: 'rgba(0,0,0,0.5)',
      textAlign: 'center',
      lineHeight:'500px',
      color: '#fff'
    }
    const comparisons = this.state.comparisons
      .map( (string, index) => {
        return(
          <div key={index}>
            <input type="text" value={string} onChange={this.setComparison.bind(this, index)} />
            { index>0 &&
              <Button tabIndex="-1" bsSize="small" className="worst" onClick={this.removeComparison.bind(this, index)}>Remove</Button>
            }
          </div>
        )
      })

    let dropzoneRef
    console.log(this.state)
    console.log(this)

    return(
      <Dropzone
        ref={(node) => { dropzoneRef = node; }}
        disableClick
        style={{}}
        accept="image/jpeg, image/png, image/gif"
        onDrop={this.onDrop.bind(this)}
        onDragEnter={this.onDragEnter.bind(this)}
        onDragLeave={this.onDragLeave.bind(this)}
      >
        <NavBar />
        <div className="container">
          <h2>Let's create a new collection!</h2>
          <hr />
          { this.state.error && <div className="error-flash"><h3>{this.state.error}</h3></div>}
          { dropzoneActive && <div style={overlayStyle}>Drop images...</div> }
          <form onSubmit={this.handleSubmit}>
            <div className="singleField">
              <label htmlFor="title">Title</label><br />
              <input id="title" type="text" onChange={this.setField.bind(this, "title")}/>
            </div>
            <div className="singleField">
              <label>Comparison questions</label>
              {this.state.comparisons.length<10 && 
                <Button tabIndex="-1" className="add" bsSize="small" onClick={this.addComparison.bind(this)}>Add</Button>
              }
              <div>
                { comparisons }
              </div>
            </div>
            <div className="singleField">
              <label htmlFor="categories">Categories, separated by space</label><br />
              <input id="categories" type="text" onChange={this.setField.bind(this, "categories")}/>
            </div>

            <p>Drag and drop images or press button below</p>
            <Button onClick={() => { dropzoneRef.open() }}>
              Upload files
            </Button>
            <div className="preview-container">
              {
                files.map((f, index)=> {
                  return (
                    <div key={index} >
                      { f[1] && <div className="loader imageloader">Loading...</div> }
                      <img className={f[1]?'preview loading':'preview'} src={f[0].preview} alt="" />
                      <div className="previewDelete">
                        <Button
                          onClick={this.removeFile.bind(this, f[0])}
                          className="worst"
                          bsSize="small"
                        >Delete</Button>
                      </div>
                    </div>
                  )}
                )
              }
            </div>
            <hr />
            <Button type="submit">Create</Button>
          </form>
        </div>
      </Dropzone>
    )
  }
}
