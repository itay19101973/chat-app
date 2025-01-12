exports.getRegisterPage = (req, res) => {
    res.render('register', { title: 'Register Page' });
};

exports.getPasswordPage = (req, res) => {
    const { email, firstName, lastName } = req.query;
    res.render('register-password', { title: 'Password Page',
        email, firstName, lastName
    });
};