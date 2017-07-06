const pool = require('../db/')

const getUserById = (req, res) => {

  const query = 
  `SELECT json_agg(json_build_object(
    'id', account_id,
    'email',email,
    'name', accountname,
    'using_pass', password,
    'last_login', last_login,
    'of_age', of_age
  )) FROM account WHERE account_id = $1`

  pool.query(query, [parseInt(req.params.id)])
  .then( result => {
    if(result.rows[0].json_agg !== null){
      result.rows[0].json_agg[0].using_pass = !!result.rows[0].json_agg[0].using_pass
      return res.json({ success: true, data: result.rows[0].json_agg[0] }) 
    }else{
      return res.status(404).json({ success:false, data: "No user found" })
    }
  })
  .catch( err => res.status(500).json({ success: false, data: err }) )

}

module.exports = getUserById