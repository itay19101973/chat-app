// controllers/messages.js
const Message = require("../models/Message");
const User = require("../models/User");
const {where} = require("sequelize");
// TODO : DELETED MESSAGE NOT DELETED - ADD PARANOID MODE AND ADD FUNCTIONALITY THAT CHECKS THAT
exports.getAllMessages = async function (req, res) {
    try {
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


exports.findMessages = async function(req, res) {
    try {
        const msgText = req.params.msgText;
        const { Op } = require('sequelize');

        const messages = await Message.findAll({
            where: {
                content: {
                    [Op.like]: `%${msgText}%`
                }
            },
            include: [{
                model: User,
                attributes: ['id', 'firstName']
            }],
            order: [['createdAt', 'DESC']],
            limit: 20 // Limit results to prevent overwhelming response
        });

        res.json(messages);
    } catch (error) {
        console.error('Error searching messages:', error);
        res.status(500).json({ success: false, message: 'Error searching messages' });
    }
};