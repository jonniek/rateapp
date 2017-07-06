const pool = require('../db/')

const addStar = (req, res) => {

  if(parseInt(req.params.id) !== req.token.account_id){
    return res.json({ success:false, error:"ID mismatch"})
  }

  const { col_id } = req.body
  const queryparams = [req.token.account_id, col_id]

  const query = `
    INSERT INTO star (account_id, col_id)
    VALUES($1, $2)
  `

  pool.query(query, queryparams)
  .then( result => {
    return res.json({ success: true, message: "Star added!" })
  }).catch( err => res.status(500).json({ success: false, data: err }) )

}

module.exports = addStar