const jwt = require('jsonwebtoken');
const User = require('../models/User')

const JWT_SECRET = 'Harryisagood$oy';

const fetchuser = (req, res, next) => {
    //Get the user from jwt and add is to req
    const token = req.header('auth-token')
    if (!token) {
        res.status(401).send('Please authenticate using valid credentials')
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user
        next()
    } catch (error) {
        res.status(401).send('Please authenticate using valid credentials')
    }
}

module.exports = fetchuser;