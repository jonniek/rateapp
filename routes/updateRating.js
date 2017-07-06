const pool = require('../db/')
const { 
  calcRating
} = require('../functions')

const updateRating = (req, res) => {
  const { winner, loser, question } = req.body
  const id = req.params.id

  if(!!!winner || !!!loser || !!!question) {
    return res.status(400).json({ success:false, message:"invalid parameters" })
  }

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
}

module.exports = updateRating