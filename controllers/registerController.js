const { User } = require("../models/User")

const registerGetController = (req, res) => {
  res.render('pages/home/register', { checkRegister: true })
}
const registerPostController = async (req, res) => {
  let username = req.body['registration[username]'];
  let email = req.body['registration[email]'];
  let password = req.body['registration[password]'];
  try {
    let data = await User.create({
      username, email, password
    })
    res.render('pages/home/login', { checkLogin: true, username })
  } catch (error) {
    res.render('pages/home/register', { checkRegister: false })
  }
}

module.exports = {
  registerGetController,
  registerPostController
}
