const Users = require('../models/users');
const Cookies = require('cookies');
const keys = ['keyboard cat'];


exports.handleUserRegistration = (req, res) => {
    const {email, firstName, lastName, password} = req.body;

    try {

        let user = {email, firstName, lastName, password};
        Users.addUser(user);
        const cookies = new Cookies(req, res, { keys: keys });
        cookies.set('userInfo', null, { maxAge: 0, path: '/' });
    }
    catch (error) {
        return res.render('register-password', {
            errorMessage:  "Something went wrong , can't add to server , please try again.",
            title: 'Password Page',
            email: email,
            firstName: firstName,
            lastName: lastName
        });
    }

    res.render('login', {title: "Login", registered : "You are now registered!"})
};

exports.getRegisterPage = (req, res) => {
    const cookies = new Cookies(req, res, { keys: keys });
    let userInfo = cookies.get('userInfo');

    console.log('User Info from cookies:', userInfo);
    if (!userInfo) {
        res.render('register', { title: 'Register Page' });
    }
    else {
        // Parse the JSON string from the cookie
        userInfo = JSON.parse(userInfo);
        res.render('register', {
            title: 'Register Page',
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email
        });
    }
};

exports.getPasswordPage = (req, res) => {
    const { email, firstName, lastName } = req.query;
    // create cookie

    const cookies = new Cookies(req, res, { keys: keys });
    cookies.set('userInfo', JSON.stringify({
            email: email,
            firstName: firstName,
            lastName: lastName
        }),
        {
            path: '/',      // Cookie is available site-wide
            maxAge: 30000   // Cookie lasts for 30 seconds (in milliseconds)
        }
    );



    res.render('register-password', { title: 'Password Page',
        email: email,
        firstName: firstName,
        lastName: lastName
    });
};