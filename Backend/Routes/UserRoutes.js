const express = require('express');
const router = express.Router();
const User = require('../Models/UserSchema');
const bcrypt = require('bcrypt');
const validator = require("email-validator");
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.send('Hey from Users Route')
});

// Register a New User
router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const response = { message: '', error: '' };

        // check if user already exists or not
        const userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            response.error = 'User already exists!';
            return res.status(409).json(response);
        }

        // check if email is valid or not using validator npm package
        if (!validator.validate(email)) {
            response.error = 'Please enter a valid email!';
            return res.status(400).json(response);
        }

        // Password validation using regular expression
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

        if (!passwordRegex.test(password)) {
            response.error = 'Password must be 6 characters or more and contain at least one uppercase and one lowercase character.';
            return res.status(400).json(response);
        }

        // using bcrypt, hash the password 
        const hashedPassword = await bcrypt.hash(password, 12);

        // save new user if all above checks are true
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        response.message = 'User created successfully';
        return res.status(201).json(response);
    } catch (error) {
        console.error('Internal Server Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Login User
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const response = { user: null, message: '', error: '' };

        // check if user exists or not using username
        const user = await User.findOne({ username });
        if (!user) {
            response.error = 'Invalid login credentials';
            return res.status(400).json(response);
        }

        // compare password using bcrypt compare method
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({
                _id: user._id.toString()
            }, process.env.JWT_SECRET_KEY);

            response.user = user;
            response.message = 'User logged in successfully!';
            response.token = token;

            return res.status(200).json(response);
        } else {
            // If passwords don't match, return an authentication failed message
            response.error = 'Invalid Login Credentials';
            return res.status(401).json(response);
        }
    } catch (error) {
        console.error('Internal Server Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;