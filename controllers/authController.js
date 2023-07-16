const {User} = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
// show login form
module.exports.viewLogin = async (req, res)=>{
    try{
        res.render('pages/user/signIn/signIn')
    }catch(e){
        console.log(e);
    }
}
// login
module.exports.login = async (req, res)=>{
    try {
      console.log(req.body.email)
        const data = await User.findOne({
          email: req.body.email,
        });

        if (data) {
          const checkPassword = await bcrypt.compare(
            req.body.password,
            data.password
          );
          if (checkPassword) {
            const UserID = data._id;
            const token = jwt.sign(`${UserID}`, "kai");
            const a = await User.updateOne(
              { _id: data._id },
              { token: token }
            );
            res.cookie("user", token, {
              expires: new Date(Date.now() + 6000000),
            });
            res.json({
              message: "login success",
              status: 200,
              err: false,
              userid: UserID,
            });
          } else {
            res.json({ message: " incorrect password" });
          }
        } else {
          res.json({ message: "login failed", status: 400, err: false });
        }
      } catch (err) {
        console.log(76, err);
      }
}
// view regiter
module.exports.viewRegister = async (req, res) => {
    try{
        res.render('pages/user/signUp/signUp')
    }catch (err) {
        console.log(err);
    }
}
// register 
module.exports.register = async (req, res)=>{
    try {
        console.log(61, req.body);
        const password = await bcrypt.hash(req.body.password, 10);
        let newUser = await User.create({
          username: req.body.username,
          password: password,
          name: req.body.username,
          email: req.body.email,
          role: "user",
        });
        console.log(72,newUser);
        res.json({
          message: "login success",
          status: 200,
          err: false,
        });
      } catch (err) {
        res.json(err);
      }
}