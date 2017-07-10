import jwtDecode from 'jwt-decode'

const get = (url, query) => fetch(url + stringifyQuery(query))
const post = (url, body, query) => fetcher(url, "POST", body)
const put = (url, body, query) => fetcher(url, "PUT", body)
const del = (url, body, query) => fetcher(url, "DELETE", body)
const fetcher = (url, method, body, query) => {
  const finalurl = query ? url+stringifyQuery(query) : url
  console.log(finalurl)
  return fetch(finalurl, {
    method,
    body: JSON.stringify(body),
    headers:{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  })
}

const stringifyQuery = query => {
  let output = "?"
  if (typeof query !== 'object') return ""

  for (let key in query) {
    if(query[key] !== null){
      if(output!=="?") output+='&'
      output += `${key}=${encodeURIComponent(query[key])}`
    }
  }
  return output
}

export async function createUser(user={}){
  const body = { ...user }
  
  const response = await post('/api/users', body)

  const { data, success } = await response.json()

  if(success) localStorage.setItem("token", data.token)

  return success
}

export async function verifyToken(){
  const token = localStorage.getItem("token")
  if(token){
    const response = await get('/api/verify', { token })
    const { success } = await response.json()
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
  const { success } = await response.json()
  return success
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