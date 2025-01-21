const User = require('../models/User');
const Cookies = require('cookies');
const keys = ['keyboard cat'];
const REGISTER = 30000;
const { validateEmail, validateName } = require('./users');

exports.handleUserRegistration = async (req, res) => {
    const endSessionE = "Your session has ended, please try again.";
    let { email, firstName, lastName, password } = req.body;
    email = email.trim().toLowerCase();
    lastName = lastName.trim();
    firstName = firstName.trim();
    password = password.trim();
    const cookies = new Cookies(req, res, { keys: keys });

    try {
        const userInfo = cookies.get('userInfo');
        if (!userInfo) {
            throw new Error(endSessionE);
        }

        if (!validateEmail(email) || !validateName(firstName) || !validateName(lastName) ||
            password.length > 32 ) {
            throw new Error("Invalid input data");
        }

        await User.create({
            email,
            firstName,
            lastName,
            password // Note: In a real app, hash the password
        });

        cookies.set('userInfo', null, { maxAge: 0, path: '/' });
        cookies.set('registeredMessage',
            JSON.stringify({
                message: "You are now registered!"
            }),
            {
                maxAge: 1000,
                path: '/'
            });
        res.redirect('/login');

    } catch (error) {
        if (error.message === endSessionE) {
            return res.render('register', {
                errorMessage: endSessionE,
                title: 'register'
            });
        }
        return res.render('register-password', {
            errorMessage: "Something went wrong, can't add to server, please try again.",
            title: 'Password Page',
            email,
            firstName,
            lastName
        });
    }
};

exports.getRegisterPage = (req, res) => {
    const cookies = new Cookies(req, res, { keys: keys });
    let userInfo = cookies.get('userInfo');

    if (!userInfo) {
        res.render('register', { title: 'Register Page' });
    } else {
        userInfo = JSON.parse(userInfo);
        res.render('register', {
            title: 'Register Page',
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email
        });
    }
};

exports.getPasswordPage = (req, res, next) => {
    const { email, firstName, lastName } = req.query;

    if (!email || !firstName || !lastName) {
        return res.redirect("/register");
    }

    const cookies = new Cookies(req, res, { keys: keys });
    cookies.set('userInfo', JSON.stringify({
        email,
        firstName,
        lastName
    }), {
        path: '/',
        maxAge: REGISTER
    });

    res.render('register-password', {
        title: 'Password Page',
        email,
        firstName,
        lastName
    });
};
