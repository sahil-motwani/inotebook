const express = require('express')
const User = require('../models/User')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router();
const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = 'Harryisagood$oy';

//ROUTE:1 create a user using POST No auth required : /api/auth/createuser
router.post('/createuser', [
    body('name', 'name should be greater then 3 characters').isLength({ 'min': 3 }),
    body('email', 'Insert a proper email').isEmail(),
    body('password', 'password should be greater then 5 characters').isLength({ 'min': 5 })
], async (req, res) => {
    let success= false;
    //checking for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() })
    }
    //checking that user already exist or not
    try {
        let user = await User.findOne({ 'email': req.body.email })
        if (user) {
            return res.status(400).json({ success,error: 'email already exists' })
        }
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)
        //creating a user and storing in DB
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success=true
        res.json({success, authtoken })
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send(success,'Internal server error')
    }
})

//ROUTE:2 login a user using POST no auth required: /api/auth/login
router.post('/login', [
    body('email', 'Insert a proper email').isEmail(),
    body('password', 'Password cannot be blank ').exists()
], async (req, res) => {
    let success = false;
    //checking for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() })
    }
    const { email, password } = req.body
    //checking that user already exist or not
    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success,error: 'please login with correct credentials' })
        }

        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            return res.status(400).json({ success,error: 'please login with correct credentials' })
        }
        //creating a user and storing in DB
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success=true;
        res.json({success, authtoken })
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send(success,'Internal server error')
    }
})

//ROUTE:3 Get user details using POST Login required: /api/auth/getuser
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userid = req.user.id;
        const user = await User.findById(userid).select('-password')
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Internal server error')
    }

})

module.exports = router;