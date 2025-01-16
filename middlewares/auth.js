// middleware/auth.js
const users = require('../models/users');
const Cookies = require('cookies');
const keys = ['keyboard cat'];


const checkEmailAvailability = (req, res, next) => {
    const email = req.query.email?.toLowerCase();

    if (users.findByEmail(email)) {
        return res.render('register', {
            errorMessage: 'This email is already in use, please choose another one',
            title: 'Register'
        });
    }
    next();
};

module.exports = { checkEmailAvailability};