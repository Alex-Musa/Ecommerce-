const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken') // to generate token
const bcrypt = require('bcryptjs') // encrypt password 


// check validation for requests
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar'); // get user image by email

// Models
const User =require('../models/User');
const { token } = require('morgan');

// @Router POST api/user/register
// @desc Register user
// @ access Public
router.post('/register', [
    // validation
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please Enter a password with 6 or more characters').isLength({
        min: 6
    })
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    // Get name and email and password from request 
    const { name, email, password } = req.body;
    try {
        // check if user already exist
        let user = await User.findone({ email });

        // if user exist
        if(user){
            return res.status(400).json({
                errors: [
                    {
                        msg: 'User already exists'
                    }
                ]
            })
        }

        // IF NOT EXISTS GET IMAGE FROM GRAVATAR
        const avatar = gravatar.url(email, {
            s: '200', // Size
            r: 'pg', // Rate
            d: 'mm'
        })

        
        // create user object 
        user = new User({
            name,email,avatar,password
        })

        // encrypt password
        const salt = await bcrypt.genSalt(10); // generate salt contains 10

        // Save Password
        user.password = await bcrypt.hash(password, salt) // user user password and salt to hash password

        // Save User in Database
        await user.save();

        // Payload to generate token
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET, {
                expiresIn: 360000 // FOR DEVELOPMENT FOR PRODUCTION IT WILL BE 3600
            },(err, token) => {
                if(err) throw err
                res.json({ token})
            }
        )
    } catch(error) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }

})

module.exports = router