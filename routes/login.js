const express = require('express');

const router = express.Router();

const loginController = require('../controllers/login');
const registerController = require('../controllers/register');

router.get('/', loginController.getLoginPage);

router.get('/register', registerController.getRegisterPage)

module.exports = router;