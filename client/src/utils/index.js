
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