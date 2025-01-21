const Cookies = require('cookies');
const keys = ['keyboard cat'];
const User = require('../models/User');

exports.getLoginPage = (req, res) => {
    const cookies = new Cookies(req, res, { keys: keys });

    let registeredMessage = cookies.get('registeredMessage');

    if(!registeredMessage)
    {
        res.render('login', { title: 'Login Page' });
    }
    else
    {
        registeredMessage = JSON.parse(registeredMessage);
        res.render('login', { title: 'Login Page',
            registered: registeredMessage.message});
    }


};

exports.handleUserLogin = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.trim().toLowerCase();
        password = password.trim();

        const user = await User.findOne({
            where: {
                email: email,
                password: password // Note: In a real app, use proper password hashing
            }
        });

        if (user) {
            req.session.email = email;
            req.session.loggedIn = true;
            req.session.userName = user.firstName;
            res.redirect('/chat');
        } else {
            res.render('login', {
                title: 'Login Page',
                errorMessage: 'Username or Password are not correct. Please try again.'
            });
        }
    } catch (error) {
        res.render('login', {
            title: 'Login Page',
            errorMessage: 'An error occurred during login. Please try again.'
        });
    }
};

exports.logout = (req, res) => {
    req.session.loggedIn = false;
    res.redirect('/');
};














