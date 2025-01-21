const Messages = require("./messages");
let nextId = 0;
const Message = require("../models/Message.js");

exports.getAllMessages = function (req, res) {
   res.json(Messages.getAllMessages());
}

exports.addMessage = function (req, res) {
    let content = req.body.message.trim();
    const newMessage = new Message(nextId++, content,  req.session.userName , req.session.email);
    res.json(Messages.addMessage(newMessage));
}

exports.updateMessage = function(req, res) {
    const messageId = parseInt(req.params.id);  // Extract message ID from params

    let oldMessage = Messages.getMessageById(messageId);
    if(!oldMessage){
        res.status(404).json({ success: false, message: 'page not found.' });
    }
    if(oldMessage.email !== req.session.email){
        res.status(404).json({ success: false, message: 'Message not found.'});
    }


    const newContent = req.body.message.trim(); // New message content

    res.json( Messages.updateMessage(messageId, newContent));
}

exports.deleteMessage = function (req, res) {
    const messageId = parseInt(req.params.id);  // Extract message ID from params

    let oldMessage = Messages.getMessageById(messageId);
    if(!oldMessage){
        res.status(404).json({ success: false, message: 'page not found.' });
    }
    if(oldMessage.email !== req.session.email){
        res.status(404).json({ success: false, message: 'Message not found.'});
    }

    res.json( Messages.deleteMessage(messageId, newContent));
}


























