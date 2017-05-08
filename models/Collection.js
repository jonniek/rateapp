var mongoose = require('mongoose')
var db = mongoose.connection
var Schema = mongoose.Schema
var random = require('mongoose-simple-random');

var Collection = new Schema({
  ownerId: {type: Schema.ObjectId, ref: 'User'},
  title: String,
  subtitle: [String],
  categories: [String],
  url: String,
  private: Boolean,
  images: [{type: Schema.ObjectId, ref: 'Image'}],
  votes: {type: Number, default: 0},
  stars: {type: Number, default: 0}
});
Collection.plugin(random);

var Collection = module.exports = mongoose.model('Collection', Collection)

module.exports.createCollection = function(collection, callback){
    collection.save(callback)
}

module.exports.getRandomColection = function(callback){
  Collection.findOneRandom(callback)
}

module.exports.incrementStarsById = function(id, callback){
  Collection.findOneAndUpdate({_id:id},{$inc:{stars:1}}, callback);
}

module.exports.decrementStarsById = function(id, callback){
  Collection.findOneAndUpdate({_id:id},{$inc:{stars:-1}}, callback);
}

module.exports.getAllCollections = function(callback){
    Collection.find()
      .select({"ownerId":1, "title":1,"_id":1,"categories":1,"url":1,"stars":1,"votes":1,"images":1})
      .populate("images", {"_id":0, "url":1})
      .populate("ownerId", {"_id":1, "username":1})
      .exec(callback)
}

module.exports.incrementVotesbyUrl= function(url, callback){
    Collection.findOneAndUpdate({url:url},{$inc:{votes:1}}, callback);
}

module.exports.getCollectionsbyOwner= function(ownerid, callback){
  Collection.find({ownerId:ownerid})
    .select({"ownerId":1,"title":1,"_id":0,"categories":1,"url":1,"stars":1,"images":1})
    .populate("images", {"_id":0, "url":1})
    .populate("ownerId", {"_id":1, "username":1})
    .exec(callback)
}

module.exports.checkCollectionNsfwByUrl= function(path, callback){
    Collection.findOne({url:path}).populate('ownerId').exec(callback);
}

module.exports.getAllPublicCollections= function(callback){
    Collection.find({private:false, nsfw:false}).populate('ownerId').populate('images').exec(callback)
}

module.exports.getAllPublicCollectionsNsfw= function(callback){
    Collection.find({private:false}).populate('ownerId').populate('images').exec(callback)
}

module.exports.getCollectionbyUrl= function(path,callback){
    Collection.findOne({url:path}).populate('ownerId').populate({ 
											     path: 'images',
											     populate: {
											       path: 'rating',
											       model: 'Rating'
											     } 
											  }).exec(callback)
}

module.exports.addImageToCollection = function(imageid,id,callback){
    Collection.findOneAndUpdate({_id:id},{$push:{images:imageid}},{new: true}, function(err, hub){
    	if(err) throw err;
    	return hub;
    });
}