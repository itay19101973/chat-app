const User = require('../models/User');

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

exports.checkSession = (req, res, next) => {
    if (!req.session.loggedIn) {
        return res.status(401).json({ redirect: '/' });
    } else {
        next();
    }
};

exports.checkLoggedIn = (req, res, next) => {
    if(req.session.loggedIn) {
        return res.redirect('/chat');
    }
    else{
        next();
    }
}