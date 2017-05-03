var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/rateapp')
var db = mongoose.connection

var multer = require('multer')
var upload = multer({ dest: './public/uploads/' })

var async = require('async')

var Collection = require('./models/Collection')
var Image = require('./models/Image')
var Rating = require('./models/Rating')
var User = require('./models/User')

var app = express()

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
	if(!b.winner || !b.loser || !b.question) { res.status=404;res.json({error:"invalid parameters"}); return}
	Rating.calculateRating(b.winner, b.loser, b.question, function(err, response){
		if (err) throw err;
		Collection.incrementVotesbyUrl(req.params.collid, function(err, r){if(err)throw err;})
		res.json({status: "sent"})
	})

})

app.post('/api/users', function(req, res){
	User.createUser(new User(), function(err, response){
		res.json(response)
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

app.get('/api/users/:collection/collections', function(req, res){
	var target = req.params.collection
	Collection.getCollectionsbyOwner(target, function(err, response){
		res.json(response)
	})
})

app.get('/api/collections', function(req, res){
	Collection.getAllCollections(function(err, response){
		if(err) throw err;
		res.json(response)
	})
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

function randomString(length) {
	var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-'
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

app.listen(3001)
console.log('Listening on port 3001...')
