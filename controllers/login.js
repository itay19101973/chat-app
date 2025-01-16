const Cookies = require('cookies');
const keys = ['keyboard cat'];

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