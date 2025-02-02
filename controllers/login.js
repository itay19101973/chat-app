const Cookies = require('cookies');
const keys = ['keyboard cat'];
const User = require('../models/User');
const bcrypt = require('bcrypt');
const loginPageTitle = 'Login Page';

/**
 * Renders the Login page, optionally displaying a registration message if available in cookies.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} Renders the 'login' page with or without a registration message.
 */
exports.getLoginPage = (req, res) => {
    const cookies = new Cookies(req, res, { keys: keys });

    let registeredMessage = cookies.get('registeredMessage');

    if(!registeredMessage)
    {
        res.render('login', { title: loginPageTitle });
    }
    else
    {
        registeredMessage = JSON.parse(registeredMessage);
        res.render('login', { title: loginPageTitle,
            registered: registeredMessage.message});
    }


};

/**
 * Handles user login by verifying credentials and setting session data.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing login credentials.
 * @param {string} req.body.email - The user's email address.
 * @param {string} req.body.password - The user's password.
 * @param {Object} res - The response object.
 * @returns {void} Redirects to '/chat' on success or re-renders 'login' with an error message on failure.
 */

exports.handleUserLogin = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.trim().toLowerCase();
        password = password.trim();

        const user = await User.findOne({
            where: {
                email
            }
        });

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            req.session.email = email;
            req.session.loggedIn = true;
            req.session.userName = user.firstName;
            req.session.userId = user.id;
            req.session.lastUpdated = "";
            res.redirect('/chat');
        } else {
            res.render('login', {
                title: loginPageTitle,
                errorMessage: 'Username or Password are not correct. Please try again.'
            });
        }
    } catch (error) {
        res.render('login', {
            title: loginPageTitle,
            errorMessage: 'An error occurred during login. Please try again.'
        });
    }
};

/**
 * Logs out the user by invalidating the session and redirects to the homepage.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} Redirects to the homepage after logging out.
 */
exports.logout = (req, res) => {
    req.session.loggedIn = false;
    res.redirect('/');
};














