const 
	express = require('express'),
	bodyParser = require('body-parser'),
	multer = require('multer'),
	upload = multer({ dest: './public/uploads/' }),
	logger = require('morgan'),
	path = require('path')

/* Express app instance */
const app = express()

/* Logger to see requests */
app.use(logger('dev'))

/* parser to receive data with api calls */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/* Static folder that will contain uploaded images and builded react-app */
app.use(express.static(path.join(__dirname, 'public')))

/* Middleware to verify and decode jwt */
const { verifyToken } = require('./functions')

/* ROUTES */
const {
	createUser,
	loginUser,
	getUsers,
	getUserById,
	updateUser,
	createCollection,
	removeCollection,
	randomCollection,
	getCollections,
	getCollectionById,
	updateRating,
	addStar,
	removeStar
} = require('./routes/')


/* ------ USER API ------- */
/* CREATE A TEMPORARY OR PERMANENT USER */
app.post('/api/users', createUser)

/* LOGIN USER */
app.post('/api/users/login', loginUser)

/* GET ALL USERS */
app.get('/api/users', getUsers)

/* GET A SPECIFIC USER BY ID */
app.get('/api/users/:id', getUserById)

/* USER UPDATE */
app.put('/api/users/:id', verifyToken, updateUser)

/* GET ALL INFORMATION OF USER */
app.get('/api/users/:id/full', (req, res) => {
	//TODO
})

/* ------ COLLECTION API ------- */
/* CREATE COLLECTION */
app.post('/api/collections', verifyToken, createCollection)

/*REMOVE COLLECTION */
app.delete('/api/collections/:id', verifyToken, removeCollection)

/* GET RANDOM COLLECTION */
app.get('/api/collection/random', randomCollection)

/* GET A LIST OF COLLECTIONS */
app.get('/api/collections', getCollections)

/* GET A COLLECTION BY ID */
app.get('/api/collections/:id', getCollectionById)

/* UPDATE RATING VALUES FOR COLLECTION IMAGE RATINGS */
app.put('/api/collections/:id/rating', updateRating)

/* ADD A USER STAR TO COLLECTION */
app.put('/api/users/:id/stars', verifyToken, addStar)

/* REMOVE A USER STAR FROM COLLECTION */
app.delete('/api/users/:id/stars', verifyToken, removeStar)

/* GET COLLECTION BY OWNER ID */
app.get('/api/users/:id/collections', (req, res) => {
	//TODO
})


/* IMAGE UPLOAD API */
app.post('/api/image', upload.array('image'), (req, res) =>{
	res.json({ filename: req.files[0].filename })
})


/* SERVE THE API 404 PAGE */
app.get('/api/*', function(req, res){
	res.status(404).json({ success: false, error: "No api route found" })
})

/* SERVE THE HTML FOR ALL EXCEPT API ROUTES */
app.get('*', function(req, res){
	res.sendFile(path.join(__dirname, 'public', 'index.html'))
})



app.listen(3001)
console.log('Listening on port 3001...')
