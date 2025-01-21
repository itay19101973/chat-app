const Cookies = require('cookies');
const keys = ['keyboard cat'];
const Users = require('../models/users');

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

exports.handleUserLogin = (req, res) => {
    let { email,password } = req.body;
    email = email.trim().toLowerCase();
    password = password.trim();
    let userName = Users.checkUserExists(email,password);
    if (userName){
        req.session.loggedIn = true;
        req.session.user = userName;
        res.redirect('/chat');
    }
    else{
        res.render('login', { title: 'Login Page', errorMessage: 'Username or Password are not correct. Please try again.' });
    }
}

exports.logout = (req,res)=>{
    req.session.loggedIn = false;
    res.redirect('/');
}

















