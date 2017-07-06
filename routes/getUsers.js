const pool = require('../db/')

const getUsers = (req, res) => {

  const query =
    `SELECT json_agg(json_build_object(
      'id', account_id,
      'email',email,
      'name', accountname,
      'last_login', last_login,
      'of_age', of_age
    )) FROM account`

  pool.query(query)
  .then( result => res.json({ success: true, data: result.rows[0].json_agg }) )
  .catch( err => res.status(500).json({ success: false, data: err }) )

}

module.exports = getUsers