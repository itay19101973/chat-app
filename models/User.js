/**
 * Defines the 'User' model for the database.
 *
 * The 'User' model represents users in the system with personal information and associated messages.
 * The model is defined using Sequelize ORM with validation for user fields and associations to messages.
 *
 * @module UserModel
 */

const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Message = require('./Message');

/**
 * The User model defines the structure of the 'User' table in the database.
 *
 * @typedef {Object} User
 * @property {number} id - The unique identifier for the user (auto-incremented).
 * @property {string} firstName - The user's first name.
 * @property {string} lastName - The user's last name.
 * @property {string} email - The user's email (unique).
 * @property {string} password - The user's hashed password (bcrypt).
 *
 * @see sequelize.define
 */
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 32],
            is: /^[a-zA-Z]+$/
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 32],
            is: /^[a-zA-Z]+$/
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            len: [3, 255]
        }
    },
    password: {
        type: DataTypes.STRING(60), // Specify length for bcrypt hash
        allowNull: false,
        validate: {
            len: [60, 60] // Bcrypt always generates 60-character hashes
        }
    }
});


// Define associations
Message.belongsTo(User);
User.hasMany(Message);

module.exports = User;