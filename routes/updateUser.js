const pool = require('../db/')
const { 
  createHash,
  check_userpassword,
  query_from_model
} = require('../functions')

const updateUser = async (req, res) =>{
  if(parseInt(req.params.id) !== req.token.account_id){
    return res.json({ success:false, error:"ID mismatch"})
  }

  let newpassword = null
  // check if password will be changed
  if(req.body.newpassword){
    try{
      const { correct } = 
        await check_userpassword({ account_id: req.token.account_id }, req.body.oldpassword)
      if(correct == false) return res.json({ success:false, error:"Invalid password" })
      newpassword = await createHash(req.body.newpassword)
    }catch(e){
      return res.status(500).json({ success: false, error: e, message:"password"})
    }
  }

  // Create the user model
  const user = {
    email: req.body.email || null,
    accountname: req.body.username || null,
    avatar_url: req.body.avatar || null,
    of_age: req.body.of_age || null,
    password: newpassword
  }

  // Create the sql SET string and push values to queryparams
  const { query, queryparams } = query_from_model(user, [req.token.account_id])
  // if there is nothing to update
  if(queryparams.length===1){
    return res.json({ success: false, message: "Nothing to update" })
  }

  const updquery = `
    UPDATE account
    SET ${query}
    WHERE account_id = $1
  `

  pool.query(updquery, queryparams)
  .then( result => {
    if(result.rowCount === 1){
      return res.json({ success: true, message: "User information updated" })
    }else{
      return res.status(500).json({ success: false, message: "Unknown error" })
    }
  })
  .catch( err => res.status(500).json({ success: false, data: err }) )

}

module.exports = updateUser