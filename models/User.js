var mongoose = require('mongoose')
var db = mongoose.connection
var Schema = mongoose.Schema
var bcrypt = require('bcrypt-nodejs')

var User = new Schema({
  username:  { type:String, default: "anon" },
  password: { type: String, default: randomString(10)},
  stars: [{type: Schema.ObjectId, ref: 'Collection'}],
  //birthday: Date,
  //admin: Boolean
})

var User = module.exports = mongoose.model('User', User)

module.exports.createUser = function(newUser, callback){
  newUser.save(callback)
}

module.exports.getAllUsers = function(callback){
  User.find({}, {username:1}, callback)
}

module.exports.addStar = function(userid, pass, starid, callback){
  User.findOneAndUpdate({_id:userid, password: pass},{$push:{stars:starid}}, callback);
}

module.exports.removeStar = function(userid, pass, starid, callback){
  User.findOneAndUpdate({_id:userid, password:pass}, {$pull:{stars:starid}}, callback);
}

module.exports.getUserbyUsername = function(username,callback){
  User.findOne({username:username}, callback)
}

module.exports.getUserbyId = function(id,callback){
  User.findById(id).select({'username':1}).exec(callback)
}

module.exports.checkPassOfUser = function(hash, id, callback){
  User.findOne({_id: id, password: hash}, callback)
}

module.exports.comparePassword = function(password, hash, callback){
  bcrypt.compare(password, hash, function(err, isMatch){
    if(err) throw err
    callback(null,isMatch)
  })
}

function randomString(length) {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-'
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
