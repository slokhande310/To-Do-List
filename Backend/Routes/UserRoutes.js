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

        // check if email is valid or not using validator npm package
        if (!validator.validate(email)) {
            return res.status(400).send({ message: 'Please Enter Valid Email!' });
        }

        // check if user already exists or not
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(409).send({ message: 'User already exists!' });
        }

        // Password validation using regular expression
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).send({ message: 'Invalid password. It must be at least 6 characters long and contain at least one uppercase and one lowercase character.' });
        }

        // using brcypt, hash the password 
        const hashedPassword = await bcrypt.hash(password, 12);

        // save new user if all above checks are true
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        return res.status(201).send({ message: 'User created successfully' })
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // check if user exists or not using username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send({ message: 'Invalid login credentials' });
        }

        // compare password using bcrypt compare method
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({
                _id: user._id.toString()
            }, process.env.JWT_SECRETKEY)

            return res.status(200).send({ user, message: 'User logged in successfully!', token });
        } else {
            // If passwords don't match, return an authentication failed message
            return res.status(401).send({ message: 'Invalid Login Credentials' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

module.exports = router;