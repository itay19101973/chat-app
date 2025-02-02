// controllers/messages.js
const Message = require("../models/Message");
const User = require("../models/User");

/**
 * Retrieves the most recent timestamp from the message records, including created, updated, and deleted timestamps.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} Sends the newest date as a JSON response or an error message on failure.
 */

exports.getUpdatedDate = function (req, res){
    Message.findAll({
        attributes: ['createdAt','updatedAt','deletedAt'],
        paranoid: false,
    }).then(messages => {
        let newestDate = null;

        messages.forEach(row => {
            const { createdAt, updatedAt, deletedAt } = row.dataValues;
            [createdAt, updatedAt, deletedAt].forEach(date => {
                if (date && (!newestDate || date > newestDate)) {
                    newestDate = date;
                }
            });
        });
        res.status(200).json(newestDate);
    }).catch(err => {
        res.status(500).json({err});
    });
}

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

/**
 * Adds a new message to the database and returns the created message.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing the message content.
 * @param {string} req.body.message - The message content.
 * @param {Object} req.session - The session object containing user details.
 * @param {number} req.session.userId - The ID of the user sending the message.
 * @param {Object} res - The response object.
 * @returns {void} Sends the created message as a JSON response or an error message on failure.
 */

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

/**
 * Updates an existing message if the user is authorized.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {number} req.params.id - The ID of the message to update.
 * @param {Object} req.body - The request body containing the new message content.
 * @param {string} req.body.message - The updated message content.
 * @param {Object} req.session - The session object containing user details.
 * @param {number} req.session.userId - The ID of the user attempting to update the message.
 * @param {Object} res - The response object.
 * @returns {void} Sends the updated message as a JSON response or an error message on failure.
 */
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

/**
 * Deletes a message if the user is authorized.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {number} req.params.id - The ID of the message to delete.
 * @param {Object} req.session - The session object containing user details.
 * @param {number} req.session.userId - The ID of the user attempting to delete the message.
 * @param {Object} res - The response object.
 * @returns {void} Sends a success message or an error message on failure.
 */
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
/**
 * Retrieves the details of the logged-in user.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.session - The session object containing user details.
 * @param {string} req.session.userName - The username of the logged-in user.
 * @param {number} req.session.userId - The ID of the logged-in user.
 * @param {Object} res - The response object.
 * @returns {void} Sends the user's details as a JSON response.
 */
exports.getUserDetails = (req, res) => {
    res.json({
        userName: req.session.userName,
        userId: req.session.userId
    });
}

/**
 * Searches for messages containing a specific text and returns the results.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.msgText - The text to search for in messages.
 * @param {Object} res - The response object.
 * @returns {void} Sends the search results as a JSON response or an error message on failure.
 */
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