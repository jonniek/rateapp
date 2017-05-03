var mongoose = require('mongoose')
var db = mongoose.connection
var Schema = mongoose.Schema
var elo = require('elo-rank')(30);


var Rating = new Schema({
  rating:[Number],
})

var Rating = module.exports = mongoose.model('Rating', Rating)

module.exports.createRating = function(newRating, callback){
  newRating.save(callback)
}

module.exports.getRatingbyId= function(id,callback){
  Rating.findById(id, callback)
}

module.exports.calculateRating = function(a, b, id, callback){
  Rating.findById(a,  function(err, imageA){
    if (err) throw err
    Rating.findById(b, function(err, imageB){
    	if (err) throw err
    	var newArating, newBrating;

    	//console.log(imageA.rating[id],imageB.rating[id]);

    	var expectedScoreA = elo.getExpected(imageA.rating[id], imageB.rating[id])
		  var expectedScoreB = elo.getExpected(imageB.rating[id], imageA.rating[id])
			
      newArating = elo.updateRating(expectedScoreA, 1, imageA.rating[id]);
		  newBrating = elo.updateRating(expectedScoreB, 0, imageB.rating[id]);

    	imageA.rating[id] = newArating
    	imageB.rating[id] = newBrating
	    imageA.markModified('rating');
    	//console.log(imageA.rating[id],imageB.rating[id])
    	imageA.save(function(err){
        if (err) throw err
		    imageB.markModified('rating');
    		imageB.save(callback)
    	})
    })
  })
}