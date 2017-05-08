
export function createUser(){
  if(localStorage){
    const id = localStorage.getItem("userid")
    const hash = localStorage.getItem("userhash")
    if(!id || !hash){
      return new Promise( resolve => {
        fetch("/api/users", {
          method: "POST",
        }).then( res => res.json() )
        .then( res => {
          if(localStorage){
            localStorage.setItem("userid", res._id)
            localStorage.setItem("userhash", res.password)
            localStorage.setItem("username", res.username)
            resolve(res._id)
          }
        })
      })
    }else{
      return new Promise( resolve => {
        resolve(id)
      })
    }
  }
}

export function getUser(id){
  return new Promise(resolve => {
    fetch('/api/users/'+id)
      .then(res => res.json())
      .then(data => {
        resolve(data)
      })
  })
}

export function getUsers(){
  return new Promise(resolve => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        resolve(data)
      })
  })
}

export function getUserDeep(id){
  return new Promise(resolve =>{
    fetch('/api/users/'+id+'/deep')
      .then(res => res.json())
      .then(data => {
        resolve(data)
      })
  })
}

export function saveName(newname){
  return new Promise( resolve => {
    const id = localStorage.getItem("userid")
    const hash = localStorage.getItem("userhash")
    fetch('/api/users/'+id, {
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({username: newname, password: hash})
    }).then( res => res.json())
    .then( data => {
      resolve(data.message)
    })
  })
}