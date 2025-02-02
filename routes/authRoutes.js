const express = require('express');

const router = express.Router();

const loginController = require('../controllers/login');
const registerController = require('../controllers/register');
const aboutController = require('../controllers/about');
const {checkEmailAvailability, checkLoggedIn} = require("../middlewares/auth");

router.get('/', checkLoggedIn, loginController.getLoginPage);

router.get('/logout', loginController.logout)

router.get('/login', checkLoggedIn, loginController.getLoginPage);

router.post('/login' ,loginController.handleUserLogin )

router.get('/about', aboutController.getAboutModal);

router.get('/register',checkLoggedIn, registerController.getRegisterPage);

router.get('/register-password',checkLoggedIn, checkEmailAvailability, registerController.getPasswordPage);

router.post('/register', registerController.handleUserRegistration)


module.exports = router;