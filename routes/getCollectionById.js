const pool = require('../db/')

const getCollectionById = (req, res) => {

  const query =
  `SELECT get_collection($1)`

  pool.query(query, [parseInt(req.params.id)])
  .then( result => {
    if(result.rows[0].get_collection.id !== null){
      result.rows[0].get_collection.owner = result.rows[0].get_collection.owner[0]
      return res.json({ success: true, data: result.rows[0].get_collection }) 
    }else{
      return res.status(404).json({ success:false, data: "No resource found" })
    }
  })
  .catch( err => res.status(500).json({ success: false, data: err }) )

}

module.exports = getCollectionById