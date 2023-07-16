const { User } = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_PASSWORD, JWT_EXPIRESIN } = process.env

const loginGetController = (req, res) => {
  res.render('pages/home/login', { checkLogin: true, username: null })
}
const loginPostController = async (req, res) => {
  let username = req.body._username;
  let password = req.body._password;
  User.findOne({ username: username }, (error, user) => {
    if (user) {
      bcrypt.compare(password, user.password, (error, same) => {
        if (same) { // if passwords match
          // store user session, will talk about it later
          delete user._doc.password;
          const token = jwt.sign({ user }, JWT_PASSWORD, { expiresIn: JWT_EXPIRESIN })
          res.cookie('app-user', token, { expries: new Date(Date.now + 900000) })
          req.session.userId = user._id
          global.userName = username;
          console.log(global.userName);
          return res.redirect('/home')
        } else {
          res.render('pages/home/login', { checkLogin: false, username: undefined })
        }
      })
    } else {
      res.render('pages/home/login', { checkLogin: false, username: undefined })
    }
  })
}

module.exports = {
  loginGetController, loginPostController
}
