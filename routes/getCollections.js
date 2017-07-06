const pool = require('../db/')

const getCollections = (req, res) => {
  
  const query =
    `SELECT json_agg(collection) FROM collection`

  pool.query(query)
  .then( result => res.json({ success: true, data: result.rows[0].json_agg }) )
  .catch( err => res.status(500).json({ success: false, data: err }) )

}

module.exports = getCollections