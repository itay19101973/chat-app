// controllers/messages.js
const Message = require("../models/Message");
const User = require("../models/User");
const {where} = require("sequelize");

exports.getAllMessages = async function (req, res) {
    try {
        let latestMessage = await Message.findAll({
            order: [["updatedAt", "DESC"]],
            limit: 1
        });

        if (latestMessage.length === 0) {
            return res.status(204).json({ message: 'no update needed' });
        }

        latestMessage = latestMessage[0];

        // Compare with session value
        if (latestMessage.updatedAt.toISOString() === req.session.lastUpdated) {
            console.log("No updated messages available");
            return res.status(204).json({ message: 'No update required' });
        }

        // Update session value
        req.session.lastUpdated = latestMessage.updatedAt;

        // Fetch all messages
        const messages = await Message.findAll({
            include: [{
                model: User,
                attributes: ['id', 'firstName']
            }],
            order: [['createdAt', 'ASC']]
        });

        res.json(messages); // Return the messages
    } catch (error) {
        console.error('Error fetching messages:', error); // Log the error to help debug
        res.status(500).json({ success: false, message: 'Error fetching messages' });
    }
};

exports.addMessage = async function (req, res) {
    try {
        const content = req.body.message.trim();
        const newMessage = await Message.create({
            content: content,
            UserId: req.session.userId
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

        if (message.UserId !== req.session.userId) {
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

        if (message.UserId !== req.session.userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this message' });
        }

        await message.destroy();

        res.json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting message' });
    }
}

exports.getUserDetails = (req, res) => {
    res.json({
        userName: req.session.userName,
        userId: req.session.userId
    });
}