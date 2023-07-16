const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
const { JWT_PASSWORD, JWT_EXPIRESIN } = process.env

const checkLogin = async (req, res, next) => {
    const userCokie = req.cookies['app-user']
    if (!userCokie) {
        return res.redirect('/login');
    }
    try {
        const checkUser = await User.findOne({ _id: userCokie });
        if (!checkUser) {
            return res.redirect('/login');
        }
        req.user = checkUser
        next()
    } catch (err) {
        return res.redirect('/login');
    }
}

const checkRole = async (req, res, next) => {
    try {
        if (req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ message: 'role is not allowed' })
        }
    } catch (err) {
        // return res.redirect('/login');
        return res.status(403).json({ message: 'role is not allowed' })
    }
}


const checkToken = async (req, res, next) => {
    const userCookie = req.cookies['app-user'];
    if (!userCookie) return res.redirect('/login');

    try {
        let data = jwt.verify(userCookie, JWT_PASSWORD);
        req.user = data.user
        next();
    } catch (error) {
        if (error.message == 'jwt expired') {
            return res.redirect('/login');
        } else {
            return res.redirect('/login');
        }
    }
}
const checkToken1 = async (req, res, next) => {
    let searchTokenUser
    try {
        let token = req.headers.authorization
        searchTokenUser = await User.findOne(
            { token: token }
        )
        if (searchTokenUser) {
            let id = jwt.verify(token, 'check')
            if (id) {
                delete searchTokenUser._doc.token
                delete searchTokenUser._doc.password
                req.user = searchTokenUser
                next()
            }
        } else {
            res.json('cant not find user')

        }
    } catch (error) {
        if (error.message == 'jwt expired') {
            res.json({ message: 'jwt expired' })
        } else {
            res.json(error)
        }
    }
}



module.exports = { checkToken, checkRole, checkLogin }