const Users = require('../models/users');

exports.handleUserRegistration = (req, res) => {
    const {email, firstName, lastName, password} = req.body;

    try {

        let user = {email, firstName, lastName, password};
        Users.addUser(user);
    }
    catch (error) {
        return res.render('register-password', {
            errorMessage: 'This email is already in use, please choose another one',
            title: 'Password Page',
            email: email,
            firstName: firstName,
            lastName: lastName
        });
    }

    res.render('login', {title: "Login", registered : "You are now registered!"})
};

exports.getRegisterPage = (req, res) => {
    res.render('register', { title: 'Register Page' });
};

exports.getPasswordPage = (req, res) => {
    const { email, firstName, lastName } = req.query;
    res.render('register-password', { title: 'Password Page',
        email: email,
        firstName: firstName,
        lastName: lastName
    });
};