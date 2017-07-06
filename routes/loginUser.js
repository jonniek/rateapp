const {
  createToken, 
  update_lastlogin,
  check_userpassword
} = require('../functions')

const loginUser = async (req, res) => {
  const { password, email } = req.body
  try{
    const { correct, user } = await check_userpassword({ email: email }, password)
    if(correct!==true){
      return res.status(422).json({ success: false, message: "Invalid password" })
    }
    const token = await createToken({ account_id: user.account_id })
    update_lastlogin(user.account_id)
    return res.json({ message: "Logged in", success: true, token })
  }catch(e){
    return res.status(500).json({ success: false, error: e })
  }
}

module.exports = loginUser