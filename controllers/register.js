const Users = require('../models/users');
const Cookies = require('cookies');
const keys = ['keyboard cat'];
const REGISTER =30000


exports.handleUserRegistration = (req, res) => {
    const endSessionE = "Your session has ended, please try again."
    let {email, firstName, lastName, password} = req.body;
    email = email.trim().toLowerCase();
    lastName = lastName.trim();
    firstName = firstName.trim();
    password = password.trim();
    const cookies = new Cookies(req, res, { keys: keys });

    try {
        let user = {email, firstName, lastName, password};
        const userInfo = cookies.get('userInfo');
        if(userInfo) {
            Users.addUser(user);
            cookies.set('userInfo', null, { maxAge: 0, path: '/' });
        }
        else{
            throw new Error(endSessionE);
        }

    }
    catch (error) {
        if(error.message === endSessionE ) {
            return res.render('register', {
                errorMessage:  endSessionE,
                title: 'register'
            });
        }
        return res.render('register-password', {
            errorMessage:  "Something went wrong , can't add to server , please try again.",
            title: 'Password Page',
            email: email,
            firstName: firstName,
            lastName: lastName
        });
    }
    cookies.set('registeredMessage',
        JSON.stringify({
            message: "You are now registered!"
        }),
        {
            maxAge : 1000,
            path: '/'
        });
    res.redirect('/login');
};

exports.getRegisterPage = (req, res) => {

    const cookies = new Cookies(req, res, { keys: keys });
    let userInfo = cookies.get('userInfo');

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

exports.getPasswordPage = (req, res, next) => {
    const { email, firstName, lastName } = req.query;

    if(!email || !firstName || !lastName) {
        res.redirect("/register");
    }
    // create cookie

    const cookies = new Cookies(req, res, { keys: keys });
    cookies.set('userInfo', JSON.stringify({
            email: email,
            firstName: firstName,
            lastName: lastName
        }),
        {
            path: '/',      // Cookie is available site-wide
            maxAge: REGISTER   // Cookie lasts for 30 seconds (in milliseconds)
        }
    );



    res.render('register-password', { title: 'Password Page',
        email: email,
        firstName: firstName,
        lastName: lastName
    });

    next();
};