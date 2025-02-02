const User = require('../models/User');
const Cookies = require('cookies');
const keys = ['keyboard cat'];
const REGISTER = 30000;
const { validateEmail, validateName } = require('./users');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Handles user registration, including validation, password hashing, and saving to the database.
 * Clears session and redirects to the login page if successful, or renders the appropriate error message if not.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing user details.
 * @param {string} req.body.email - The email address of the user.
 * @param {string} req.body.firstName - The first name of the user.
 * @param {string} req.body.lastName - The last name of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The response object.
 * @returns {void} Redirects to the login page or renders the error message.
 */
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

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await User.create({
            email,
            firstName,
            lastName,
            password: hashedPassword
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

/**
 * Renders the user registration page with pre-filled user info from cookies if available.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} Renders the register page with or without pre-filled user data.
 */
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

/**
 * Renders the password page during user registration, saving user details to cookies for future use.
 * If the necessary parameters are not present, redirects to the register page.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.query - The request query containing user details.
 * @param {string} req.query.email - The email address of the user.
 * @param {string} req.query.firstName - The first name of the user.
 * @param {string} req.query.lastName - The last name of the user.
 * @param {Object} res - The response object.
 * @returns {void} Renders the password page or redirects to the register page.
 */
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
