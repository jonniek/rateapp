const pool = require('../db/')

const removeStar = (req, res) =>{

  if(parseInt(req.params.id) !== req.token.account_id){
    return res.json({ success:false, error:"ID mismatch"})
  }

  const { col_id } = req.body
  const queryparams = [req.token.account_id, col_id]

  const query = `
    DELETE FROM star
    WHERE account_id = $1 AND col_id = $2
  `

  pool.query(query, queryparams)
  .then( result => {
    return res.json({ success: true, message: "Star removed!" })
  }).catch( err => res.status(500).json({ success: false, data: err }) )

}

module.exports = removeStar