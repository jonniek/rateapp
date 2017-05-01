var mongoose = require('mongoose')
var db = mongoose.connection
var Schema = mongoose.Schema

var Message = new Schema({
  userid:  String,
  username:  String,
  message: String,
  timestamp: Date
})

var Message = module.exports = mongoose.model('Message', Message)

module.exports.createMessage = function(newMessage, callback){
    newMessage.save(callback)
}

module.exports.getAllMessages= function(callback){
    Message.find({},callback)
}
