var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/rateapp')
var db = mongoose.connection

var multer = require('multer')
var upload = multer({ dest: './public/uploads/' })

var async = require('async')

var jwt = require('jsonwebtoken')

var Collection = require('./models/Collection')
var Image = require('./models/Image')
var Rating = require('./models/Rating')
var User = require('./models/User')

var app = express()

app.set('superSecret', 'Redbean-flyinc-dragonfly')

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

var path = require('path');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.serveFile(path.join(__dirname, 'public', 'index.html'))
})

app.put('/api/collections/:collid/rating', function(req, res){
	var b = req.body
	if(!!b.winner && !!b.loser && (!!b.question || b.question==0)) {
		Rating.calculateRating(b.winner, b.loser, b.question, function(err, response){
			if (err) throw err;
			Collection.incrementVotesbyUrl(req.params.collid, function(err, r){if(err)throw err;})
			res.json({status: "sent"})
		})
	}else{
		res.status=404;res.json({error:"invalid parameters"}); return
	}

})

app.post('/api/users', function(req, res){
	User.createUser(new User({stars:[],collections:[]}), function(err, response){
		if(err) throw err;
		console.log(response)
		var token = jwt.sign({ id: response._id}, app.get('superSecret'), {
      expiresIn: '24h'
    })
		res.json({ success: true, token: token, username: response.username })
	})
})

app.get('/api/users', function(req, res){
	User.getAllUsers(function(err, response){
		if(err) throw err;
		res.json(response)
	})
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

app.get('/api/random/collection', function(req, res){
	Collection.getRandomColection(function(err, response){
		if(err) throw err;
		res.json({url:response.url})
	})
})

app.get('/api/collections/:id', function(req, res){
	var target = req.params.id
	Collection.getCollectionbyUrl(target, function(err, response){
		if(err) throw err;
		res.json(response)
	})
})

app.get('/api/users/:id', function(req, res){
	var target = req.params.id
	User.getUserbyId(target, function(err, response){
		if(err) throw err;
		res.json(response)
	})
})

app.get('/api/users/:id/deep', function(req, res){
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

app.get('/api/collections', function(req, res){
	Collection.getAllCollections(function(err, response){
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

//ADD ROUTE SERCURING MIDDLEWARE
app.use(function(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token']
	console.log("Someone came with token:",token)
	if (token) {
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' })   
      } else {
        // if everything is good, save to request for use in other routes
        req.userid = decoded
        next()
      }
    });
	}else{
		return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    })
	}
})


app.put('/api/users/:id', function(req, res){
	var id = req.params.id
	var name = req.body.username
	if(!name){
		res.json({message:"Failed, try another name"})
	}else{
		User.updateUsername(id, name, function(err, response){
			if(err) throw err;
			res.json({success: true, message:"Success!"})
		})
	}
})

app.post('/api/verifytoken', function(req, res){
	res.json({success: true, message:"Token is valid"})
})

function randomString(length) {
	var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-'
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

app.listen(3001)
console.log('Listening on port 3001...')
