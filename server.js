const 
	express = require('express'),
	bodyParser = require('body-parser'),
	multer = require('multer'),
	upload = multer({ dest: './public/uploads/' }),
	logger = require('morgan'),
	jwt = require('jsonwebtoken'),
	path = require('path'),
	pool = require('./db/'),
	bcrypt = require('bcrypt-nodejs')
	Elo = require('elo-rank')

const elo = new Elo(30)

const app = express()

app.set('superSecret', 'Redbeandownstreamdragonfly')

app.use(logger('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))

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
	console.log("REQUESTED VERIFICATION")
	var token = req.body.token || req.query.token || req.headers['x-access-token']
	if (token) {
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' })   
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
	const { query, queryparams } = query_from_model(where, [])
	return pool.query(`SELECT password, account_id FROM account WHERE ${query}`, queryparams)
}

/* COMPARE A STRING AND HASH WITH A RESOLVE AND REJECT */
const compareHash = (string, hash, cb) => {
	bcrypt.compare(string, hash, cb)
}

/* CREATE HASH FROM PASSWORD */
const createhash = (pass) => {
	return new Promise((resolve, reject) => {
		bcrypt.hash(pass, null, null, (err, hash) =>{
			if(err) return reject("Error while hashing, try again")
			return resolve(hash)
		})
	})
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
const query_from_model = (model, queryparams) => {
	let query = ""
	let i = queryparams.length + 1
	for (let key in model) {
		if(model[key] !== null){
			queryparams.push(model[key])
			if(query!=="") query+=", "
			query += `${key}=$${i}`
			i += 1
		}
	}
	return { query, queryparams }
}

/* TOKEN CREATION */
const createToken = (content, expiresIn='14d') => {
	return new Promise( (resolve, reject) => {
		jwt.sign(content, app.get('superSecret'), { expiresIn }, (err, token) => {
			if(err) reject(err)
			resolve(token)
		})
	})
}

/* TOKEN REFRESH */
const refreshToken = (token, expiresIn='14d') => {
	return jwt.sign({account_id:token.account_id}, app.get('superSecret'), { expiresIn })
}

/* ROUTES */

/* SERVE THE HTML FOR ALL EXCEPT API ROUTES */
app.get('/', function(req, res){
	res.serveFile(path.join(__dirname, 'public', 'index.html'))
})

/* TOKEN REFRESH */
app.post('/api/refreshtoken', verifyToken, function(req, res){
	const token = refreshToken(req.token)
	return res.json({success: true, token})
})

/* ------ USER API ------- */
/* CREATE A TEMPORARY OR PERMANENT USER */
app.post('/api/users', async function(req, res){
	const email = req.body.email || null
	const accountname = req.body.username || null
	let password = req.body.password || null

	const query =
		`INSERT INTO account (email, accountname, password)
		VALUES ($1, $2, $3) RETURNING account_id`

	try{
		if(password) password = await createhash(password)
		const result = await pool.query(query, [email, accountname, password])
		const token = await createToken(result.rows[0])
		return res.json({ success: true, data: { token } })
	}catch(e){
		res.status(500).json({ success: false, data: err })
	}
})

/* LOGIN USER */
app.post('/api/users/login', async (req, res) => {
	const { password, email } = req.body
	try{
		const { correct, user } = await check_userpassword({ email: email }, password)
		if(correct!==true){
			return res.status(422).json({ success: false, message: "Invalid password" })
		}
		const token = await createToken({ account_id: user.account_id })
		return res.json({ message: "Logged in", success: true, token })
	}catch(e){
		return res.status(500).json({ success: false, error: e })
	}


})

/* GET ALL USERS */
app.get('/api/users', function(req, res){

	const query =
		`SELECT json_agg(json_build_object(
			'id', account_id,
			'email',email,
			'name', accountname,
			'last_login', last_login,
			'of_age', of_age
		)) FROM account`

	pool.query(query)
	.then( result => res.json({ success: true, data: result.rows[0].json_agg }) )
	.catch( err => res.status(500).json({ success: false, data: err }) )

})

/* GET A SPECIFIC USER BY ID */
app.get('/api/users/:id', function(req, res){

	const query = 
	`SELECT json_agg(json_build_object(
		'id', account_id,
		'email',email,
		'name', accountname,
		'using_pass', password,
		'last_login', last_login,
		'of_age', of_age
	)) FROM account WHERE account_id = $1`

	pool.query(query, [parseInt(req.params.id)])
	.then( result => {
		if(result.rows[0].json_agg !== null){
			result.rows[0].json_agg[0].using_pass = !!result.rows[0].json_agg[0].using_pass
			return res.json({ success: true, data: result.rows[0].json_agg[0] }) 
		}else{
			return res.status(404).json({ success:false, data: "No user found" })
		}
	})
	.catch( err => res.status(500).json({ success: false, data: err }) )

})

/* USER UPDATE */
app.put('/api/users/:id', verifyToken, async function(req, res){
	if(parseInt(req.params.id) !== req.token.account_id){
		return res.json({ success:false, error:"ID mismatch"})
	}

	let newpassword = null
	// check if password will be changed
	if(req.body.newpassword){
		try{
			const { correct } = 
				await check_userpassword({ account_id: req.token.account_id }, req.body.oldpassword)
			if(correct == false) return res.json({ success:false, error:"Invalid password" })
			newpassword = await createhash(req.body.newpassword)
			console.log(newpassword)
		}catch(e){
			return res.status(500).json({ success: false, error: e, message:"password"})
		}
	}

	// Create the user model
	const user = {
		email: req.body.email || null,
		accountname: req.body.username || null,
		avatar_url: req.body.avatar || null,
		of_age: req.body.of_age || null,
		password: newpassword
	}

	// Create the sql SET string and push values to sqlparams
	const { query, queryparams } = query_from_model(user, [req.token.account_id])
	// if there is nothing to update
	if(queryparams.length===1){
		return res.json({ success: false, message: "Nothing to update" })
	}

	const updquery = `
		UPDATE account
		SET ${query}
		WHERE account_id = $1
	`

	pool.query(updquery, queryparams)
	.then( result => {
		if(result.rowCount === 1){
			return res.json({ success: true, message: "User information updated" })
		}else{
			return res.status(500).json({ success: false, message: "Unknown error" })
		}
	})
	.catch( err => res.status(500).json({ success: false, data: err }) )

})

/* ------ COLLECTION API ------- */

/* GET RANDOM COLLECTION */
app.get('/api/collection/random', function(req, res){

	const query =
		`SELECT json_agg(collection) FROM 
			(SELECT * FROM collection ORDER BY RANDOM() LIMIT 1)
		AS collection`

	pool.query(query)
	.then( result => res.json({ success: true, data: result.rows[0].json_agg[0] }) )
	.catch( err => res.status(500).json({ success: false, data: err }) )

})

app.get('/api/collections', function(req, res){
	
	const query =
		`SELECT json_agg(collection) FROM collection`

	pool.query(query)
	.then( result => res.json({ success: true, data: result.rows[0].json_agg }) )
	.catch( err => res.status(500).json({ success: false, data: err }) )

})

app.get('/api/collections/:id', function(req, res){

	const query = 
	`SELECT json_agg(collection) FROM collection WHERE col_id = $1`

	pool.query(query, [parseInt(req.params.id)])
	.then( result => {
		if(result.rows[0].json_agg !== null){
			return res.json({ success: true, data: result.rows[0].json_agg[0] }) 
		}else{
			return res.status(404).json({ success:false, data: "No resource found" })
		}
	})
	.catch( err => res.status(500).json({ success: false, data: err }) )

})

/* UPDATE RATING VALUES */
app.put('/api/collections/:id/rating', function(req, res){
	const { winner, loser, question } = req.body
	const id = req.params.id

	if(!!winner && !!loser && (!!question || question==0)) {

		const findrating = `
			SELECT * FROM rating r
			LEFT JOIN image i
			ON i.image_id = r.image_id
			WHERE r.question_id = $3 AND ( r.image_id=$2 OR r.image_id=$1)
		`

		const updaterating = `
			UPDATE rating
			SET rating = $2
			WHERE rating_id = $1
		`

		pool.query(findrating, [parseInt(winner), parseInt(loser), parseInt(question)])
		.then( result => {
			if(result.rowCount == 2){
				const firstwon = result.rows[0].image_id == winner
				const winnerjson = firstwon ? result.rows[0] : result.rows[1]
				const loserjson = firstwon ? result.rows[1] : result.rows[0]
				const newratings = calcRating(winnerjson.rating, loserjson.rating)

				pool.query(updaterating, [winnerjson.rating_id, newratings.winner])
				.then( pool.query(updaterating, [loserjson.rating_id, newratings.loser] ))
				.then( () => res.json({ success: true, message: "Ratings updated" }))
				.catch( err => res.status(500).json({ success: false, data: err }) )

			}else{
				return res.status(404).json({ success:false, message: "No resource found" })
			}
		})
		.catch( err => res.status(500).json({ success: false, data: err }) )
	}else{
		return res.status(400).json({ success:false, message:"invalid parameters" })
	}
})

app.put('/api/users/:id/stars', function(req, res){
	var userid = req.params.id
	var pass = req.body.userhash
	var starid = req.body.starid
	console.log(req.params, req.body)
	console.log(userid, pass, starid)
	if(!starid || !pass || !userid ){
		res.status = 404
		res.json({error:"invalid data"})
		return
	}
	User.addStar(userid, pass, starid, function(err, response){
		if(err) throw err;
		Collection.incrementStarsById(starid, function(err, response){if(err)throw err;})
		res.json({'star':'added'})
	})
})

app.delete('/api/users/:id/stars', function(req, res){
	var userid = req.params.id
	var pass = req.body.userhash
	var starid = req.body.starid
	User.removeStar(userid, pass, starid, function(err, response){
		if(err) throw err;
		Collection.decrementStarsById(starid, function(err, response){if(err)throw err;})
		res.json({'star':'removed'})
	})
})



app.get('/api/users/:id/full', function(req, res){
	User.getStarredCollectionsById(req.params.id, function(err, response){
		if(err) throw err;
		res.json(response)
	})
})

app.get('/api/users/:id/collections', function(req, res){
	var target = req.params.id
	Collection.getCollectionsbyOwner(target, function(err, response){
		if(err) throw err;
		res.json(response)
	})
})



app.delete('/api/collections/:id', function(req, res){
	var userid = req.body.userid
	var userhash = req.body.userhash
	var collid = req.params.id
	if(collid && userid && userhash){
		User.checkCollection(userid, userhash, collid, function(err, response){
			if (err) throw err;
			if(response){
				Collection.removeCollection(collid, function(err, response){
					if(err)throw err;
					res.json({success:"deleted"})
				})
			}else{
				res.json({error:"no collection found"})
			}
		})
	}else{
		res.json({error:"invalid parameters"})
	}
})

app.post('/api/collections', function(req, res){
	var tmp = req.body
  var images = req.body.images
  req.body.images = []
	tmp.url = randomString(5)
	tmp.private = false
	var hash = req.body.ownerHash
	var uid = req.body.ownerId
	User.checkPassOfUser(hash, uid, function(error, response){
		if(!response.id){
			res.status = 404
			res.json({error: "Unauthorized user"})
		}else{

			Collection.createCollection(new Collection(tmp), function(error, response){
				if(error) throw error;
				var collId = response.id

				User.addCollectionToId(uid, hash, collId, function(err, response){if(err)throw err;})

				var rating = 
					Array.apply(null, Array(req.body.subtitle.length))
						.map(Number.prototype.valueOf,1200)

				async.each(images, function(img){
					Rating.createRating(new Rating({rating: rating}), function(err, response){
						if(err) throw err;
						var newImage = new Image({
							parentId: collId,
							url: "/uploads/"+img,
							rating: response.id
						})
						Image.createImage(newImage, function(err, response2){
							Collection.addImageToCollection(response2.id, collId, function(err, hmm){
								if(err) throw err;
							})
						})
					})
				})

				res.json({ url: tmp.url })
			})
		}

	})
})

app.post('/api/image', upload.array('image'), function(req, res){
	res.json({ filename: req.files[0].filename })
})

/* 404 CALL */
app.use('/api/*', function(req, res){
	return res.status(404).json({ success:false, message: "Api route not found" })
})

function randomString(length) {
	var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-'
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

app.listen(3001)
console.log('Listening on port 3001...')
