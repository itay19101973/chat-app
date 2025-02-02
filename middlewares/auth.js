const User = require('../models/User');

/**
 * Middleware to check if the provided email is already registered in the database.
 * If the email is found, an error message is rendered on the registration page.
 * Otherwise, the request proceeds to the next middleware.
 *
 * @param {Object} req - The request object, containing the query with the email to check.
 * @param {Object} res - The response object, used to render the register page if email exists.
 * @param {Function} next - The next middleware to be called if the email is available.
 */
exports.checkEmailAvailability = async (req, res, next) => {
    try {
        const { email } = req.query;
        const existingUser = await User.findOne({
            where: { email: email.toLowerCase() }
        });

        if (existingUser) {
            return res.render('register', {
                title: 'Register Page',
                errorMessage: 'Email already exists'
            });
        }
        next();
    } catch (error) {
        res.render('register', {
            title: 'Register Page',
            errorMessage: 'Error checking email availability'
        });
    }
};

/**
 * Middleware to check if the user is logged in.
 * If not logged in, a 401 error with a redirect message is returned.
 * Otherwise, the request proceeds to the next middleware.
 *
 * @param {Object} req - The request object, used to check the session for logged-in status.
 * @param {Object} res - The response object, used to send a 401 status code if not logged in.
 * @param {Function} next - The next middleware to be called if the user is logged in.
 */
exports.checkSession = (req, res, next) => {
    if (!req.session.loggedIn) {
        return res.status(401).json({ redirect: '/' });
    } else {
        next();
    }
};

/**
 * Middleware to check if the user is already logged in.
 * If logged in, the user is redirected to the chat page.
 * Otherwise, the request proceeds to the next middleware.
 *
 * @param {Object} req - The request object, used to check the session for logged-in status.
 * @param {Object} res - The response object, used to redirect the user if logged in.
 * @param {Function} next - The next middleware to be called if the user is not logged in.
 */
exports.checkLoggedIn = (req, res, next) => {
    if(req.session.loggedIn) {
        return res.redirect('/chat');
    }
    else{
        next();
    }
}