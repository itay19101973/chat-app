// controllers/messages.js
const Message = require("../models/Message");

exports.getAllMessages = async function (req, res) {
    try {
        const messages = await Message.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching messages' });
    }
}

exports.addMessage = async function (req, res) {
    try {
        const content = req.body.message.trim();
        const newMessage = await Message.create({
            content: content,
            userName: req.session.userName,
            email: req.session.email
        });
        res.json(newMessage);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error sending message' });
    }
}

exports.updateMessage = async function(req, res) {
    try {
        const messageId = parseInt(req.params.id);
        const newContent = req.body.message.trim();

        const message = await Message.findByPk(messageId);

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        if (message.email !== req.session.email) {
            return res.status(403).json({ success: false, message: 'Unauthorized to update this message' });
        }

        message.content = newContent;
        await message.save();

        res.json(message);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating message' });
    }
}

exports.deleteMessage = async function(req, res) {
    try {
        const messageId = parseInt(req.params.id);

        const message = await Message.findByPk(messageId);

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        if (message.email !== req.session.email) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this message' });
        }

        await message.destroy();

        res.json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting message' });
    }
}

exports.getSession = (req, res) => {
    res.json({
        userName: req.session.userName,
        email: req.session.email
    });
}