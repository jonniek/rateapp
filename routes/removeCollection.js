const pool = require('../db/')

const removeCollection = (req, res) => {

  const queryparams = [req.token.account_id, req.params.id]

  const query = `
    DELETE FROM collection
    WHERE owner_id = $1 AND col_id = $2
  `

  pool.query(query, queryparams)
  .then( response => {
    if(response.rowCount == 1){
      return res.json({ success: true, message: "Collection removed" })
    }else{
      return res.status(400).json({ success:false, message:"invalid parameters" })
    }
  }).catch( err => res.status(500).json({ success: false, data: err }) )

}

module.exports = removeCollection