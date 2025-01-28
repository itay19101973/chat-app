const Cookies = require('cookies');
const keys = ['keyboard cat'];
const User = require('../models/User');
const bcrypt = require('bcrypt');

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














