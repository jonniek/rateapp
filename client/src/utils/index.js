import jwtDecode from 'jwt-decode'

export async function createUser(){
  const response = await fetch("/api/users", {
    method: "POST",
  })

  const { token, success } = await response.json()

  localStorage.setItem("token", token)

  return success
}

export async function verifyToken(){
  const token = localStorage.getItem("token")
  if(token){
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
  }
  return false
}

export async function getUser(id){
  const response = await fetch(`/api/users/${id}`)
  return await response.json()
}

export async function getUsers(){
  let response = await fetch('/api/users')
  return await response.json()
}

export async function removeCollection(id){

  const token = localStorage.getItem("token")

  const response = fetch(`/api/collections/${id}`, {
    method: 'DELETE',
    headers:{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({token})
  })

  return { success } = await response.json()
}

export async function getUserDeep(id){
  if(!id){
    const token = localStorage.getItem("token")
    if(!token) return
    const payload = jwtDecode(token)
    id = payload.id
  }
  const response = await fetch(`/api/users/${id}/deep`)
  return await response.json()
}

export async function saveName(username){
  const token = localStorage.getItem("token")
  if(!token) return false
  const { id }  = jwtDecode(token)

  const response = await fetch('/api/users/'+id, {
    method: 'PUT',
    headers:{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({username, token})
  })

  const { success } = await response.json()

  return success
}