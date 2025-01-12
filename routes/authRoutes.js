const express = require('express');

const router = express.Router();

const loginController = require('../controllers/login');
const registerController = require('../controllers/register');
const aboutController = require('../controllers/about');
const {checkEmailAvailability} = require("../middlewares/auth");

router.get('/', loginController.getLoginPage);

router.get('/login', loginController.getLoginPage);

router.get('/about', aboutController.getAboutModal);

router.get('/register', registerController.getRegisterPage);

router.get('/register-password', checkEmailAvailability, registerController.getPasswordPage);

router.post('/register', registerController.handleUserRegistration)

module.exports = router;