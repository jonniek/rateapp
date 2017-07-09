const pool = require('../db/')
const { createHash, createToken } = require('../functions')

const createUser = async function(req, res){
  const email = req.body.email || null
  const accountname = req.body.username || "anon"
  let password = req.body.password || null

  const query =
    `INSERT INTO account (email, accountname, password)
    VALUES ($1, $2, $3) RETURNING account_id`

  try{

    if(password) password = await createHash(password)
    const result = await pool.query(query, [email, accountname, password])
    const token = await createToken(result.rows[0])

    return res.json({ success: true, data: { token } })
    
  }catch(e){
    res.status(500).json({ success: false, data: e })
  }
}

module.exports = createUser