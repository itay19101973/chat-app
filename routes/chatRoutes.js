const express = require('express');
const chatController = require("../controllers/chat");


const router = express.Router();

router.get('/', chatController.getChatPage);









module.exports = router;