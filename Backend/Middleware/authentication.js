const jwt = require('jsonwebtoken');
const User = require('../Models/UserSchema');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
        const user = await User.findOne({ _id: decoded._id });

        if (!user) {
            throw new Error({ error: error.message });
        }

        req.user = user;
        req.token = token;
        next();

    } catch (error) {
        res.status(401).send({ error: 'Please Authenticate' });
    }
}

module.exports = auth;