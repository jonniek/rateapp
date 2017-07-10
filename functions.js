const 
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt-nodejs'),
  { superSecret } = require('./config'),
  pool = require('./db/'),
  Elo = require('elo-rank')

const elo = new Elo(30)

/* CREATE HASH FROM PASSWORD */
const createHash = (pass) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(pass, null, null, (err, hash) =>{
      if(err) return reject("Error while hashing, try again")
      return resolve(hash)
    })
  })
}

/* TOKEN CREATION */
const createToken = (content, expiresIn='14d') => {
  return new Promise( (resolve, reject) => {
    jwt.sign(content, superSecret, { expiresIn }, (err, token) => {
      if(err) reject(err)
      resolve(token)
    })
  })
}


/* ELO CALCULATION */
const calcRating = (win, lose) =>{

  const expectedScoreW = elo.getExpected(win, lose)
  const expectedScoreL = elo.getExpected(lose, win)

  const winner = elo.updateRating(expectedScoreW, 1, win)
  const loser = elo.updateRating(expectedScoreL, 0, lose)

  return { winner, loser }
}

/* AUTHENTICATION MIDDLEWARE FUNCTION */
const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  if (token) {
    jwt.verify(token, superSecret, function(err, decoded) {      
      if (err) {
        return res.status(422).json({ success: false, message: 'Invalid authentication token.' })   
      } else {
        req.token = decoded
        next()
      }
    })
  }else{
    return res.status(550).send({
      success: false,
      message: 'No token provided.'
    })
  }
}

/* RETURN A PROMISE OF USER WITH OBJECT PARAMETER WHERE CLAUSE */
const findUserquery = (where) => {
  const { query, queryparams } = query_from_model(where, [], ' AND ')
  return pool.query(`SELECT password, account_id FROM account WHERE ${query}`, queryparams)
}

/* COMPARE A STRING AND HASH */
const compareHash = (string, hash, cb) => {
  bcrypt.compare(string, hash, cb)
}

const randomString = (length) => {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-'
  var result = ''
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

/* PASSWORD COMPARISON by user where object { account_id: 5 } and plaintext password*/
const check_userpassword = (where, pass) => {
  return new Promise( (resolve, reject) => {
    if(!pass) pass = ""
    findUserquery(where)
    .then(result => {
      const hash = result.rows[0].password
      if(result.rowCount>1){
        return reject("Multiple users found for hash match request")
      }else if(result.rowCount==0){
        return reject("No user found")
      }else if(!hash){
        return resolve({ correct: null, user: result.rows[0] })
      }else{
        compareHash(pass, hash, (err, correct) => {
          if(err) reject("Error with hashing, try again")
          resolve({ correct, user: result.rows[0] })
        })
      }
    })
  })
}

/* CREATE SQL QUERY MAPPING -> field = $1, field2 = $2, [value1, value2] */
const query_from_model = (model, queryparams, delimiter=", ") => {
  let query = ""
  let i = queryparams.length + 1
  for (let key in model) {
    if(model[key] !== null){
      queryparams.push(model[key])
      if(query!=="") query+=delimiter
      query += `${key}=$${i}`
      i += 1
    }
  }
  return { query, queryparams }
}


/* TOKEN REFRESH */
const refreshToken = (token, expiresIn='14d') => {
  return jwt.sign({account_id:token.account_id}, superSecret, { expiresIn })
}

/* UPDATE USER LAST LOGIN */
const update_lastlogin = id => {
  pool.query('UPDATE account SET last_login = now() WHERE account_id = $1', [id])
  .catch( err => console.log("Error setting lastlogin", err))
}

/* TEST IS URL IS UNIQUE */
const uniqueCollectionUrl = url => {
  return new Promise( (resolve, reject) => {
    pool.query(`SELECT col_id FROM collection WHERE url=$1`, [url])
    .then( response => {
      if(response.rowCount==0){
        return resolve(true)
      }else{
        return resolve(false)
      }
    }).catch(e => reject(e))
  })
}

module.exports = {
  createHash,
  createToken,
  calcRating,
  verifyToken,
  findUserquery,
  compareHash,
  randomString,
  check_userpassword,
  query_from_model,
  refreshToken,
  update_lastlogin,
  uniqueCollectionUrl
}