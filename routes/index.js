const
  createUser = require('./createUser'),
  loginUser = require('./loginUser'),
  getUsers = require('./getUsers'),
  getUserById = require('./getUserById'),
  updateUser = require('./updateUser'),
  createCollection = require('./createCollection'),
  removeCollection = require('./removeCollection'),
  randomCollection = require('./randomCollection'),
  getCollections = require('./getCollections'),
  getCollectionById = require('./getCollectionById'),
  updateRating = require('./updateRating'),
  addStar = require('./addStar'),
  removeStar = require('./removeStar')

module.exports = {
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
}