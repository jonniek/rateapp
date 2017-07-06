const pool = require('../db/')

const randomCollection = (req, res) => {

  const query =
    `SELECT json_agg(collection) FROM 
      (SELECT * FROM collection ORDER BY RANDOM() LIMIT 1)
    AS collection`

  pool.query(query)
  .then( result => res.json({ success: true, data: result.rows[0].json_agg[0] }) )
  .catch( err => res.status(500).json({ success: false, data: err }) )

}

module.exports = randomCollection