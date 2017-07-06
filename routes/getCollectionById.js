const pool = require('../db/')

const getCollectionById = (req, res) => {

  const query = 
  `SELECT json_agg(collection) FROM collection WHERE col_id = $1`

  pool.query(query, [parseInt(req.params.id)])
  .then( result => {
    if(result.rows[0].json_agg !== null){
      return res.json({ success: true, data: result.rows[0].json_agg[0] }) 
    }else{
      return res.status(404).json({ success:false, data: "No resource found" })
    }
  })
  .catch( err => res.status(500).json({ success: false, data: err }) )

}

module.exports = getCollectionById