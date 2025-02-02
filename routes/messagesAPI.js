const express = require('express');
const router = express.Router();
const messagesController = require("../controllers/messages.js");
const {checkSession} = require("../middlewares/auth.js");

router.get('/messages', checkSession, messagesController.getAllMessages)

router.post('/send-message' ,checkSession , messagesController.addMessage)

// Update a message by ID (PATCH)
router.patch('/messages/:id',checkSession , messagesController.updateMessage);

// Delete a message by ID
router.delete('/messages/:id', checkSession ,messagesController.deleteMessage);

// In messagesAPI.js (routes)
router.get('/userDetails',checkSession, messagesController.getUserDetails);

router.get('/search/:msgText',checkSession, messagesController.findMessages)

router.get('/get-updated-date', checkSession, messagesController.getUpdatedDate);



module.exports = router;