import jwtDecode from 'jwt-decode'

export async function createUser(){
  try{
    let response = await fetch("/api/users", {
      method: "POST",
    })

    const { token, success } = await response.json()

    localStorage.setItem("token", token)

    return success
  }catch(e){
    console.log(e)
    return false
  }
}

export async function verifyToken(){
  const token = localStorage.getItem("token")
  if(token){
    try{

      let response = await fetch("/api/verifytoken", {
        method: "POST",
        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({token})
      })

      const {success} = await response.json()

      return success

    }catch(e){
      console.log(e)
    }
  }
  return false
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

export async function getUsers(){
  try{
    let response = await fetch('/api/users')
    return await response.json()
  }catch(e){
    console.log(e)
  }
}

export function removeCollection(id){
  return new Promise( resolve => {
    const uid = localStorage.getItem("userid")
    const hash = localStorage.getItem("userhash")
    fetch('/api/collections/'+id, {
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({userid: uid, userhash: hash})
    }).then( res => res.json())
    .then( data => {
      resolve(data.message)
    })
  })
}

export async function getUserDeep(id){
  if(!id){
    const token = localStorage.getItem("token")
    if(!token) return
    console.log("time to decode")
    const payload = jwtDecode(token)
    id = payload.id
  }
  try{
    let response = await fetch(`/api/users/${id}/deep`)
    return await response.json()
  }catch(e){
    console.log(e)
  }
}

export async function saveName(username){
  const token = localStorage.getItem("token")
  if(!token) return "Error, login expired"
  const { id }  = jwtDecode(token)

  try{
    let response = await fetch('/api/users/'+id, {
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({username, token})
    })

    const data = await response.json()

    return data.message
  }catch(e){
    console.log(e)
  }
}