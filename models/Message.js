/**
 * Defines the 'Message' model for the database.
 *
 * The 'Message' model represents messages sent by users, including content and metadata such as timestamps.
 * The model is defined using Sequelize ORM with validation and options for timestamps and soft deletion.
 *
 * @module MessageModel
 */

const { DataTypes } = require('sequelize');
const sequelize = require('./database');

/**
 * The Message model defines the structure of the 'Message' table in the database.
 *
 * @typedef {Object} Message
 * @property {number} id - The unique identifier for the message (auto-incremented).
 * @property {string} content - The text content of the message (cannot be empty).
 *
 * @see sequelize.define
 */
const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    timestamps: true,
    paranoid: true
});

module.exports = Message;