const express = require('express');
const router = express.Router();
const messagesController = require("../controllers/messages.js");

router.get('/messages', messagesController.getAllMessages)

router.post('/send-message' , messagesController.addMessage)

// Update a message by ID (PATCH)
router.patch('/messages/:id', messagesController.updateMessage);

// Delete a message by ID
router.delete('/messages/:id', messagesController.deleteMessage);

// In messagesAPI.js (routes)
router.get('/session', messagesController.getSession);





module.exports = router;