const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Message = require('./Message');


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