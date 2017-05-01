var mongoose = require('mongoose')
var db = mongoose.connection
var Schema = mongoose.Schema

var Image = new Schema({
  parentId: String,
  url: String,
  rating:{type: Schema.ObjectId, ref: 'Rating'}
});


var Image = module.exports = mongoose.model('Image', Image)

module.exports.createImage = function(image, callback){
    image.save(callback)
}

